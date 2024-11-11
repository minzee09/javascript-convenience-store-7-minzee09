const InputController = {
  parseInput(input) {
    const items = input.match(/\[([^\]]+)\]/g);
    if (!items) {
      throw new Error("[ERROR] 잘못된 입력 형식입니다. 다시 입력해 주세요.");
    }

    return items.map((item) => {
      const [name, quantity] = item.slice(1, -1).split("-");
      return {
        name: name.trim(),
        quantity: parseInt(quantity.trim(), 10),
      };
    });
  },
};

export default InputController;
