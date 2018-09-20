import { CountryOrArea } from "./countryorarea";
import { TourDateType } from "./dateType";

export class Passport {
  number: string;
  issueDate: Date;
  expiryDate: Date;
  issuePlace: CountryOrArea;
}
