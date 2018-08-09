import { Trip } from "./trip";
import { Quantity } from "./quantity";
import { BillingInfo } from "./billing-info";
import { CountryOrArea } from "./countryorarea";

export class Tour {
  id: string;
  name: string;
  availableTitles: string[];
  availabledCountryOrAreas: CountryOrArea[];
  trips: Trip[];
}
