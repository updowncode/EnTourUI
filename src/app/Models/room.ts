import { Traveller } from "./traveller";
import { RoomCfg } from "./room-cfg";
import { Promotion } from "./promotion";

export class Room {
  id: number;
  index: number;
  beddingConfig: string;
  adultMaxQuantity: number;
  childMaxQuantity: number;
  capacity: number;
  roomOriginalPriceForPerTraveller: number;
  roomPriceForPerTraveller: number; // For each traveller
  singleSupplement: number;
  childPromoAmount: number;
  roomDiscount: number;
  smokingRoom: number; // 0: Non-Smoking, 1: Smoking, -1: unknown
  extraHotelQuantity: number;
  roomCfgList: RoomCfg[];
  selectedRoomCfg: RoomCfg;
  promotionList: Promotion[];
  selectedPromotion: Promotion;
  travellers: Traveller[];
  tourId: string;
  tripId: string;
}
