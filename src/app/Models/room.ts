import { Traveller } from "./traveller";

export class Room {
  id: number;
  index: number;
  beddingConfig: string;
  capacity: number;
  roomPriceForPerTraveller: number; // For each traveller
  singleSupplement: number;
  smokingRoom: number; // 0: Non-Smoking, 1: Smoking, -1: unknown
  travellers: Traveller[];
  tourId: string;
  tripId: string;
}
