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
    this.cart = new Cart();
    this.products = loadProducts();
  }

  async run() {
    OutputView.startMessage();
    OutputView.productsList(this.products);
    await this.getUserInput();
  }

  async getUserInput() {
    InputView.readItem(async (input) => {
      try {
        const purchaseItems = this.createPurchaseItems(input); // 여러 상품을 처리
        for (const item of purchaseItems) {
          await this.applyPromotionIfEligible(item);
          this.cart.addItem(item);
        }
        await this.applyMembershipDiscountIfEligible(); // 멤버십 할인 여부 확인 및 적용
        ReceiptController.displayReceipt(this.cart);
        this.displayCartItems();
        this.displayFinalCartSummary(); // 최종 결제 금액 출력
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

    const applyPromotion = await this.promptPromotionDecision(product);
    if (applyPromotion) {
      this.applyPromotion(purchaseItem);
    }
  }

  async promptPromotionDecision(product) {
    OutputView.promotionMessage(product.name, product.promotion.get);
    try {
      const answer = await InputView.readYesNo();
      return answer === "y";
    } catch (error) {
      console.log(error.message);
      return this.promptPromotionDecision(product); // 재귀 호출로 다시 입력 요청
    }
  }

  applyPromotion(purchaseItem) {
    const discountAmount = purchaseItem.product.price * purchaseItem.product.promotion.get;
    this.cart.applyPromotionDiscount(discountAmount);
    purchaseItem.quantity += purchaseItem.product.promotion.get;
  }

  async applyMembershipDiscountIfEligible() {
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

  displayFinalCartSummary() {
    const totalAmount = this.cart.calculateTotalAmount();
    OutputView.displayTotalAmount(totalAmount); // 최종 금액 출력
  }

  displayCartItems() {
    console.log("현재 장바구니:", this.cart.getItems());
  }

  findProduct(name) {
    return this.products.find((product) => product.name === name);
  }
}

export default App;
