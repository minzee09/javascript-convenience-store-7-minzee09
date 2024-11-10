import { Console } from "@woowacourse/mission-utils";

const OutputView = {
  startMessage() {
    Console.print("안녕하세요. W편의점입니다.");
    Console.print("현재 보유하고 있는 상품입니다.\n");
  },

  productsList(products) {
    products.forEach((product) => {
      const { name, price, stock, promotion } = product;
      const stockText = stock > 0 ? `${stock}개` : "재고 없음";
      const promotionText = promotion ? promotion : "";
      Console.print(`- ${name} ${price}원 ${stockText} ${promotionText}`);
    });
  },
};

export default OutputView;
