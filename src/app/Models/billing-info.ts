import { CountryOrArea } from "./countryorarea";

export class BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  primaryPhone: string;
  secondaryPhone: string;
  mailingAddress: string;
  city: string;
  country: CountryOrArea;
  provinceStates: string;
  postalCode: string;
  agreeTermAndCondition: boolean;
  haveReadTripNotes: boolean;
  canReceiveMoreInfo: boolean;
}
