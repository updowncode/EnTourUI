import { Option } from "./option";
import { Quantity } from "./quantity";
import { Room } from "./room";
import { BillingInfo } from "./billing-info";
import { TripInclude } from "./trip-include";
import { CountryOrArea } from "./countryorarea";

export class Trip {
  id: string;
  name: string;
  selectedTravellerQuantity: Quantity;
  selectedRoomQuantity: Quantity;
  availabledRoomQuantities: Quantity[];
  availabledTravellerQuantities: Quantity[];
  startPlace: string;
  endPlace: string;
  startCountryOrArea: CountryOrArea;
  endCountryOrArea: CountryOrArea;
  startDate: string;
  endDate: string;
  tripCostForDefaultPerTraveller: number;
  tripCostForDefaultTravellerQuantity: number;
  tripSingleSupplement: number;
  minRoomQuantityForTravellers: number;
  visaPrice: number;
  tourInfoSource: string;
  billingInfo: BillingInfo;
  includedIn: TripInclude[];
  notIncludeIn: TripInclude[];
  options: Option[];
  availabledRooms: Room[];
  rooms: Room[];
  tourId: string;
}
