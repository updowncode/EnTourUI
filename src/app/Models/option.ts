import { Traveller } from "./traveller";

export class Option {
  id: number;
  location: string;
  name: string;
  price: number;
  description: string;
  toggleShowDescription: boolean;
  enabled: boolean;
  type: number;
  tourId: string;
  tripId: string;
}
