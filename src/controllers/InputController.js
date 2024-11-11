const InputController = {
  parseInput(input) {
    const match = input.match(/\[(.+)-(\d+)\]/);
    if (!match) {
      throw new Error("[ERROR] 올바르지 않은 형식으로 입력했습니다."); // 에러 던지기
    }
    const [, name, quantity] = match;
    return { name, quantity: parseInt(quantity, 10) };
  },
};

export default InputController;
