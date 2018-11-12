import { OptionSummary } from "./option-summary";

export class ReviewInfo {
  totalPrice: number;
  totalRoomPrice: number;
  totalOptionPrice: number;
  totalVisaPrice: number;
  perVisaPrice: number;
  totalVisaQuantity: number;
  totalChildDiscount: number;
  totalChildPromo: number;
  extraHotelAmount: number;
  optionSummary: OptionSummary[];
}
