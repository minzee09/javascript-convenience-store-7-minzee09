class MembershipController {
  static applyMembershipDiscount(cart) {
    const discountRate = 0.3;
    const maxDiscount = 8000;
    const totalAmount = cart.calculateTotalAmount();
    const discountAmount = Math.min(totalAmount * discountRate, maxDiscount);
    return discountAmount;
  }
}

export default MembershipController;
