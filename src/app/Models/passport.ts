import { CountryOrArea } from "./countryorarea";
import { TourDateType } from "./dateType";

export class Passport {
  number: string;
  issueDate: TourDateType;
  expiryDate: TourDateType;
  issuePlace: CountryOrArea;
}
