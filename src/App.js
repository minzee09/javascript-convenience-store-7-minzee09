import loadProducts from "./models/products.js";
import InputView from "./views/inputView.js";
import OutputView from "./views/outputView.js";

class App {
  async run() {
    const products = loadProducts();

    OutputView.startMessage();
    OutputView.productsList(products);
    InputView.askForProductPurchase();
  }
}

export default App;
