import loadProducts from "./models/products.js";
import OutputView from "./views/outputView.js";
import Cart from "./models/Cart.js";
import InputView from "./views/inputView.js";
import InputController from "./controllers/InputController.js";
import PromotionController from "./controllers/PromotionController.js";

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
        const purchaseItem = this.createPurchaseItem(input);
        await this.applyPromotionIfEligible(purchaseItem); // 프로모션 적용 여부 확인 및 처리
        this.cart.addItem(purchaseItem);
        this.displayCartItems();
      } catch (error) {
        console.log(error.message);
        await this.getUserInput();
      }
    });
  }

  createPurchaseItem(input) {
    const purchaseItem = InputController.parseInput(input);
    const product = this.findProduct(purchaseItem.name);

    if (!product) {
      throw new Error("[ERROR] 존재하지 않는 상품입니다.");
    }

    purchaseItem.product = product;
    return purchaseItem;
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
    purchaseItem.quantity += purchaseItem.product.promotion.get;
  }

  displayCartItems() {
    console.log("현재 장바구니:", this.cart.getItems());
  }

  findProduct(name) {
    return this.products.find((product) => product.name === name);
  }
}

export default App;
