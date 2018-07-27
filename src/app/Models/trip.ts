import { Option } from "./option";
import { Quantity } from "./quantity";
import { Room } from "./room";
import { BillingInfo } from "./billing-info";
import { MockTripInclude } from "./mock-trip-include";
import { CountryOrArea } from "./countryorarea";

export class Trip {
  id: number;
  name: string;
  isSelected: boolean;
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
  tripCost: string;
  tripSingleSupplement: string;
  tourInfoSource: string;
  billingInfo: BillingInfo;
  includedIn: MockTripInclude[];
  notIncludeIn: MockTripInclude[];
  options: Option[];
  rooms: Room[];
  tourId: number;
}
