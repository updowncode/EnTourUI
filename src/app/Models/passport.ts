import { CountryOrArea } from "./countryorarea";

export class Passport {
  number: string;
  issueDate: string;
  expiryDate: string;
  issuePlace: CountryOrArea;
}
