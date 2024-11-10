import { Console } from "@woowacourse/mission-utils";

const InputView = {
  async askForProductPurchase(callback) {
    const input = await Console.readLineAsync(
      "\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n",
    );
    callback(input);
  },
};

export default InputView;
