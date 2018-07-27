import { Trip } from "./trip";
import { Quantity } from "./quantity";
import { BillingInfo } from "./billing-info";

export class Tour {
  id: number;
  name: string;
  trips: Trip[];
}
