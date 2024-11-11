class Cart {
  constructor() {
    this.items = [];
    this.discount = 0;
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

  applyDiscount(discountAmount) {
    this.discount = discountAmount;
  }

  getItems() {
    return this.items;
  }
}

export default Cart;
