import { OptionSummary } from "./option-summary";

export class ReviewInfo {
  totalPrice: number;
  totalRoomPrice: number;
  totalOptionPrice: number;
  totalVisaPrice: number;
  totalVisaQuantity: number;
  totalChildPromo: number;
  extraHotelAmount: number;
  childrenQuantity: number;
  promoAmountPerChild: number;
  optionSummary: OptionSummary[];
}
