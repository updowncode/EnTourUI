import { Option } from "./option";
import { CountryOrArea } from "./countryorarea";
import { Passport } from "./passport";
import { TourDateType } from "./dateType";

export class Traveller {
  id: number;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  placeofbirth: string;
  birthday: TourDateType;
  passport: Passport;
  countryorarea: CountryOrArea;
  selectedOptions: Option[];
  needVisa: boolean;
  needInsuance: boolean;
  specialRequest: string;
  roomId: number;
}
