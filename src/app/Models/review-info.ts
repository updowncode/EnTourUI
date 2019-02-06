import { OptionSummary } from "./option-summary";

export class ReviewInfo {
  minimumDepositTotal: number;
  totalPrice: number;
  totalRoomPrice: number;
  totalOptionPrice: number;
  totalVisaPrice: number;
  totalVisaQuantity: number;
  totalChildPromo: number;
  extraHotelAmount: number;
  childrenQuantity: number;
  promoAmountPerChild: number;
  showSingleSupplment: boolean;
  optionSummary: OptionSummary[];
}
