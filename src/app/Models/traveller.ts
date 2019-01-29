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
  isChild: boolean;
  placeofbirth: CountryOrArea;
  birthday: Date;
  passport: Passport;
  countryOrArea: CountryOrArea;
  selectedOptions: Option[];
  needVisa: boolean;
  needInsuance: boolean;
  specialRequest: string;
  roomId: number;
}
