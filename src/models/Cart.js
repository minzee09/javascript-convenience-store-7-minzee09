class Cart {
  constructor() {
    this.items = [];
    this.promotionDiscount = 0;
    this.membershipDiscount = 0;
  }

  addItem(item) {
    this.items.push(item);
  }

  calculateTotalAmount() {
    return (
      this.items.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0) - this.discount
    );
  }

  applyPromotionDiscount(discountAmount) {
    this.promotionDiscount += discountAmount;
  }

  applyMembershipDiscount(discountAmount) {
    this.membershipDiscount = discountAmount;
  }

  getFinalAmount() {
    const totalAmount = this.calculateTotalAmount();
    return totalAmount - this.promotionDiscount - this.membershipDiscount;
  }

  getItems() {
    return this.items;
  }
}

export default Cart;
