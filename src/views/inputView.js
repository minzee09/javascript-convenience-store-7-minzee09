import { Console } from "@woowacourse/mission-utils";

const InputView = {
  async readItem(callback) {
    const input = await Console.readLineAsync(
      "\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n",
    );
    callback(input);
  },

  async readYesNo() {
    const answer = await Console.readLineAsync("(Y/N) ");
    this.validateYesNo(answer);
    return answer.toLowerCase();
  },

  validateYesNo(answer) {
    if (answer.toLowerCase() !== "y" && answer.toLowerCase() !== "n") {
      throw new Error("[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.");
    }
  },
};

export default InputView;
