import { DateTimes } from "@woowacourse/mission-utils";

class PromotionController {
  static isPromotionAvailable(product, quantity) {
    const promo = product.promotion;
    if (!promo) return false;

    const today = PromotionController.getCurrentDate();
    const inDateRange = today >= promo.startDate && today <= promo.endDate;
    const meetsQuantityRequirement = quantity >= promo.buy;

    return inDateRange && meetsQuantityRequirement;
  }

  static getCurrentDate() {
    const now = DateTimes.now().toISOString(); // ISO 문자열 형식으로 변환
    return now.substring(0, 10); // YYYY-MM-DD 형식으로 날짜 부분만 추출
  }
}

export default PromotionController;
