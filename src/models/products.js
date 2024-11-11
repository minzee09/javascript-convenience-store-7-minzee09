import loadFile from "../utils/fileLoader.js";

function loadProducts() {
  const productsData = loadFile("public/products.md");
  const promotionsData = loadFile("public/promotions.md");
  const promotions = parsePromotions(promotionsData);

  const products = parseProductData(productsData, promotions);

  return {
    products,
    updateProductStock: (productName, quantity) => {
      const product = products.find((p) => p.name === productName);
      if (product) {
        product.stock -= quantity;
        if (product.stock < 0) product.stock = 0; // 재고가 0 이하가 되지 않도록 설정
      }
    },
    hasSufficientStock: (productName, quantity) => {
      const product = products.find((p) => p.name === productName);
      return product && product.stock >= quantity;
    },
  };
}

function parseProductData(data, promotions) {
  const lines = data.split("\n");
  return lines.slice(1).map((line) => {
    const [name, price, stock, promotionName] = line.split(",");
    const promotion = promotions[promotionName.trim()] || null;

    return {
      name: name.trim(),
      price: parseInt(price.trim(), 10),
      stock: parseInt(stock.trim(), 10),
      promotion,
    };
  });
}

function parsePromotions(data) {
  const lines = data.split("\n");
  const promotions = {};

  lines.slice(1).forEach((line) => {
    const [name, buy, get, startDate, endDate] = line.split(",");
    promotions[name.trim()] = {
      name: name.trim(),
      buy: parseInt(buy.trim(), 10),
      get: parseInt(get.trim(), 10),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
    };
  });

  return promotions;
}

export default loadProducts;
