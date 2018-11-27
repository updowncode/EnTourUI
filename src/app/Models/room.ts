import { Traveller } from "./traveller";
import { RoomCfg } from "./room-cfg";

export class Room {
  id: number;
  index: number;
  beddingConfig: string;
  adultMaxQuantity: number;
  childMaxQuantity: number;
  capacity: number;
  roomPriceForPerTraveller: number; // For each traveller
  singleSupplement: number;
  childPromoAmount: number;
  smokingRoom: number; // 0: Non-Smoking, 1: Smoking, -1: unknown
  extraHotelQuantity: number;
  travellers: Traveller[];
  roomCfgList: RoomCfg[];
  selectedRoomCfg: RoomCfg;
  tourId: string;
  tripId: string;
}
