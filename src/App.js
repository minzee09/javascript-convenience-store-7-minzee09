import loadProducts from "./models/products.js";
import OutputView from "./views/outputView.js";

class App {
  async run() {
    const products = loadProducts();

    OutputView.startMessage();
    OutputView.productsList(products);
  }
}

export default App;
