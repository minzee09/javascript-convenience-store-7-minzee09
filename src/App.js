import loadProducts from "./models/products.js";
class App {
  async run() {
    const products = loadProducts();
  }
}

export default App;
