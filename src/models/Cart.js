class Cart {
  constructor() {
    this.items = [];
  }

  addItem(product) {
    this.items.push(product);
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
  }
}

export default Cart;
