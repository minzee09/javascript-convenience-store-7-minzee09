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
        const purchaseItems = this.createPurchaseItems(input); // 여러 상품을 처리
        for (const item of purchaseItems) {
          await this.applyPromotionIfEligible(item);
          this.cart.addItem(item);
        }
        await this.applyMembershipDiscountIfEligible(); // 멤버십 할인 여부 확인 및 적용
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
    purchaseItem.quantity += purchaseItem.product.promotion.get;
  }

  async applyMembershipDiscountIfEligible() {
    OutputView.showMembershipMessage();
    try {
      const answer = await InputView.readYesNo();
      if (answer === "y") {
        this.applyMembershipDiscount();
      }
    } catch (error) {
      console.log(error.message);
      await this.applyMembershipDiscountIfEligible(); // 잘못된 입력이 들어오면 재입력 요청
    }
  }

  applyMembershipDiscount() {
    const discountRate = 0.3; // 30% 할인율
    const maxDiscount = 8000; // 최대 8,000원 할인
    const totalAmount = this.cart.calculateTotalAmount(); // 장바구니 총액 계산
    const discountAmount = Math.min(totalAmount * discountRate, maxDiscount); // 할인 금액 계산
    this.cart.applyDiscount(discountAmount); // 장바구니에 할인 적용
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
