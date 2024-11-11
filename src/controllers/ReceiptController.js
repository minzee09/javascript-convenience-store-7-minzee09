import OutputView from "../views/outputView.js";

class ReceiptController {
  static displayReceipt(cart) {
    const items = cart.getItems();
    const totalAmount = cart.calculateTotalAmount();
    const promotionDiscount = cart.promotionDiscount;
    const membershipDiscount = cart.membershipDiscount;
    const finalAmount = cart.getFinalAmount();

    OutputView.displayReceipt(
      items,
      totalAmount,
      promotionDiscount,
      membershipDiscount,
      finalAmount,
    );
  }
}

export default ReceiptController;
