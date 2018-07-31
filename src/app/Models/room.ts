import { Traveller } from "./traveller";

export class Room {
  id: number;
  index: number;
  beddingConfig: string;
  capacity: number;
  roomPrice: number;
  isSmokingRoom: number; // 0: Non-Smoking, 1: Smoking, -1: unknown
  travellers: Traveller[];
  tourId: number;
  tripId: number;
}
