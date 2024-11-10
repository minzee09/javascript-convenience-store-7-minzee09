import loadFile from "../utils/fileLoader.js";

function loadProducts() {
  const data = loadFile("public/products.md"); // md 값 그대로 갖고 옴
  return parseProductData(data);
}

function parseProductData(data) {
  const lines = splitLines(data); // 줄 별로 묶어서 배열 반환
  return lines.slice(0).map(parseLineToProduct); // 첫째줄 제외
}

function splitLines(data) {
  return data.split("\n");
}

function parseLineToProduct(line) {
  const [name, price, stock, promotion] = line.split(",");
  return {
    name: name.trim(),
    price: parseInt(price.trim(), 10),
    stock: parseInt(stock.trim(), 10),
    promotion: parsePromotion(promotion),
  };
}

function parsePromotion(promotion) {
  return promotion.trim() === "null" ? null : promotion.trim();
}

export default loadProducts;
