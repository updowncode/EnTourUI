import { Option } from "./option";
import { CountryOrArea } from "./countryorarea";
import { Passport } from "./passport";

export class Traveller {
  id: number;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  placeofbirth: string;
  birthday: string;
  passport: Passport;
  countryorarea: CountryOrArea;
  selectedOptions: Option[];
  needVisa: boolean;
  needInsuance: boolean;
  specialRequest: string;
  roomId: number;
}
