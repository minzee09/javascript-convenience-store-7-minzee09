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
      const promotionText = promotion ? promotion.name || promotion : ""; // promotion이 객체라면 이름 출력

      console.log(`- ${name} ${price}원 ${stockText} ${promotionText}`);
    });
  },

  promotionMessage(productName, freeQuantity) {
    Console.print(
      `\n현재 ${productName}은(는) ${freeQuantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까?`,
    );
  },

  showMembershipMessage() {
    Console.print("\n멤버십 할인을 받으시겠습니까?");
  },

  displayTotalAmount(amount) {
    Console.print(`최종 결제 금액: ${amount}원`);
  },
};

export default OutputView;
