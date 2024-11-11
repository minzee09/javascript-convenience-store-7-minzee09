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

  displayReceipt(items, totalAmount, promotionDiscount, membershipDiscount, finalAmount) {
    Console.print("==============W 편의점================");
    Console.print("상품명\t\t수량\t금액");

    items.forEach((item) => {
      Console.print(
        `${item.product.name}\t\t${item.quantity}\t${item.product.price * item.quantity}`,
      );
    });

    Console.print("=============증\t정===============");
    items.forEach((item) => {
      if (item.product.promotion) {
        Console.print(`${item.product.name}\t\t${item.product.promotion.get}`);
      }
    });
    Console.print("====================================");
    Console.print(`총구매액\t\t${items.length}\t${totalAmount}`);
    Console.print(`행사할인\t\t\t-${promotionDiscount}`);
    Console.print(`멤버십할인\t\t\t-${membershipDiscount}`);
    Console.print(`내실돈\t\t\t${finalAmount}`);
    Console.print("감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)");
  },
};

export default OutputView;
