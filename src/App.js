import loadProducts from "./models/products.js";
import OutputView from "./views/outputView.js";
import Cart from "./models/Cart.js";
import InputView from "./views/inputView.js";
import InputController from "./controllers/InputController.js";
import PromotionController from "./controllers/PromotionController.js";
import MembershipController from "./controllers/MembershipController.js";
import ReceiptController from "./controllers/ReceiptController.js";

class App {
  constructor() {
    const { products, updateProductStock, hasSufficientStock } = loadProducts();
    this.products = products;
    this.updateProductStock = updateProductStock;
    this.hasSufficientStock = hasSufficientStock;
    this.cart = new Cart();
  }

  async run() {
    OutputView.startMessage();
    OutputView.productsList(this.products);
    await this.getUserInput();
  }

  async getUserInput() {
    InputView.readItem(async (input) => {
      try {
        const purchaseItems = this.createPurchaseItems(input);
        for (const item of purchaseItems) {
          if (!this.hasSufficientStock(item.product.name, item.quantity)) {
            throw new Error(
              `[ERROR] ${item.product.name}의 재고가 부족합니다. 현재 재고: ${item.product.stock}`,
            );
          }
          await this.applyPromotionIfEligible(item);
          this.cart.addItem(item);
          this.updateProductStock(item.product.name, item.quantity);
        }
        await this.applyMembershipDiscountIfEligible();
        ReceiptController.displayReceipt(this.cart);
        await this.promptAdditionalPurchase();
      } catch (error) {
        console.log(error.message);
        await this.getUserInput();
      }
    });
  }

  createPurchaseItems(input) {
    const purchaseItems = InputController.parseInput(input);
    purchaseItems.forEach((item) => {
      const product = this.findProduct(item.name);
      if (!product) {
        throw new Error(`[ERROR] 존재하지 않는 상품입니다: ${item.name}`);
      }
      item.product = product;
    });
    return purchaseItems;
  }

  async applyPromotionIfEligible(purchaseItem) {
    const { product, quantity } = purchaseItem;
    if (!PromotionController.isPromotionAvailable(product, quantity)) return;

    try {
      const applyPromotion = await this.promptPromotionDecision(product);
      if (applyPromotion) {
        this.applyPromotion(purchaseItem);
      }
    } catch (error) {
      console.log(error.message);
      await this.applyPromotionIfEligible(purchaseItem);
    }
  }

  async promptPromotionDecision(product) {
    OutputView.promotionMessage(product.name, product.promotion.get);
    const answer = await InputView.readYesNo();
    if (answer !== "y" && answer !== "n") {
      throw new Error("[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.");
    }
    return answer === "y";
  }

  applyPromotion(purchaseItem) {
    const discountAmount = purchaseItem.product.price * purchaseItem.product.promotion.get;
    this.cart.applyPromotionDiscount(discountAmount);
    purchaseItem.quantity += purchaseItem.product.promotion.get;
  }

  async applyMembershipDiscountIfEligible() {
    OutputView.showMembershipMessage();
    try {
      const answer = await InputView.readYesNo();
      if (answer === "y") {
        const discountAmount = MembershipController.applyMembershipDiscount(this.cart);
        this.cart.applyMembershipDiscount(discountAmount);
      }
    } catch (error) {
      console.log(error.message);
      await this.applyMembershipDiscountIfEligible();
    }
  }

  async promptAdditionalPurchase() {
    OutputView.askAdditionalPurchase();
    const answer = await InputView.readYesNo();
    if (answer === "y") {
      this.cart = new Cart();
      await this.run();
    } else if (answer === "n") {
      return;
    } else {
      console.log("[ERROR] 잘못된 입력입니다. Y 또는 N을 입력해 주세요.");
      await this.promptAdditionalPurchase();
    }
  }

  findProduct(name) {
    return this.products.find((product) => product.name === name);
  }
}

export default App;
