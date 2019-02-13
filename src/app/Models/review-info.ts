import { OptionSummary } from "./option-summary";

export interface ReviewInfo {
  minimumDepositTotal: number;
  totalPrice: number;
  totalRoomPrice: number;
  totalOptionPrice: number;
  totalVisaPrice: number;
  totalVisaQuantity: number;
  totalChildPromo: number;
  totalRoomDiscount: number;
  totalPromoAmount: number;
  extraHotelAmount: number;
  childrenQuantity: number;
  promoAmountPerChild: number;
  showSingleSupplment: boolean;
  showApplyPromoCode: boolean;
  PromoCodeEntered: string;
  optionSummary: OptionSummary[];
}
