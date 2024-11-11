import loadFile from "../utils/fileLoader.js";

function loadProducts() {
  const productsData = loadFile("public/products.md");
  const promotionsData = loadFile("public/promotions.md");
  const promotions = parsePromotions(promotionsData);

  return parseProductData(productsData, promotions);
}

function parseProductData(data, promotions) {
  const lines = data.split("\n");
  return lines.slice(1).map((line) => {
    const [name, price, stock, promotionName] = line.split(",");
    const promotion = promotions[promotionName.trim()] || null; // 프로모션 객체를 올바르게 할당

    return {
      name: name.trim(),
      price: parseInt(price.trim(), 10),
      stock: parseInt(stock.trim(), 10),
      promotion, // 프로모션 객체 전체를 할당
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
