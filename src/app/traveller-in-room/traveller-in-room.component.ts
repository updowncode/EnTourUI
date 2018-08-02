import {
  Component,
  OnInit,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { Traveller } from "../Models/traveller";
import { Room } from "../Models/room";
import { Trip } from "../Models/trip";
import { slideInDownAnimation } from "../animations";
import { EnTourService } from "../en-tour.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-traveller-in-room",
  templateUrl: "./traveller-in-room.component.html",
  styleUrls: ["./traveller-in-room.component.sass"],
  animations: [slideInDownAnimation]
})
export class TravellerInRoomComponent implements OnInit, OnDestroy {
  @HostBinding("@routeAnimation") routeAnimation = true;
  @HostBinding("style.display") display = "block";
  @HostBinding("style.position") position = "related";
  @Input() traveller: Traveller;
  @Input() room: Room;
  @Input() trip: Trip;
  @Input() roomIndex: number;
  @Input() roomsMoveTo: Room[];
  bedRoomsForSelectedTravellers: Room[];
  @Output() roomMovedTo = new EventEmitter<boolean>();
  selectedBedConfig: string;
  availabledBedConfigForSameRoomCapatity: string[] = [];
  showRoomInfo: boolean;
  availabledRooms: Room[];

  subscription: Subscription;

  constructor(private tourService: EnTourService) {
    this.subscription = tourService.updateRoomInfo$.subscribe(
      isRoomInfoUpdated => {
        if (isRoomInfoUpdated) {
          this.updateRoomInfo();
        }
      }
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.availabledRooms = this.tourService.getRooms(
      this.room.tourId,
      this.room.tripId
    );

    this.updateRoomInfo();
  }

  // updateRoomInfo() {
  //   if (
  //     this.traveller !== undefined &&
  //     this.traveller === this.room.travellers[0]
  //   ) {
  //     this.showRoomInfo = true;

  //     const roomsWithSameCapatity = new Array<Room>();
  //     for (let i = 0; i < this.availabledRooms.length; i++) {
  //       if (this.availabledRooms[i].capacity === this.room.capacity) {
  //         roomsWithSameCapatity.push(this.availabledRooms[i]);
  //       }
  //     }
  //     for (let i = 0; i < this.availabledRooms.length; i++) {
  //       if (
  //         this.availabledRooms[i].capacity === this.room.capacity &&
  //         this.availabledRooms[i].roomPrice ===
  //           Math.min(...roomsWithSameCapatity.map<number>(c => c.roomPrice))
  //       ) {
  //         this.selectedBedConfig = this.availabledRooms[i].beddingConfig;
  //       }
  //     }
  //     for (let i = 0; i < this.availabledRooms.length; i++) {
  //       if (this.availabledRooms[i].capacity === this.room.capacity) {
  //         if (
  //           this.availabledBedConfigForSameRoomCapatity.indexOf(
  //             this.availabledRooms[i].beddingConfig
  //           ) < 0
  //         ) {
  //           this.availabledBedConfigForSameRoomCapatity.push(
  //             this.availabledRooms[i].beddingConfig
  //           );
  //         }
  //       }
  //     }
  //   } else {
  //     this.showRoomInfo = false;
  //   }
  // }
  updateRoomInfo() {
    this.bedRoomsForSelectedTravellers = this.tourService.getRoomsByTheTravellersInTheRoom(this.room.travellers, this.availabledRooms);
    if (
      this.traveller !== undefined &&
      this.traveller === this.room.travellers[0]
    ) {
      this.showRoomInfo = true;
      this.selectedBedConfig = this.bedRoomsForSelectedTravellers[0].beddingConfig;
      this.availabledBedConfigForSameRoomCapatity = this.bedRoomsForSelectedTravellers.map(
        c => c.beddingConfig
      );
    } else {
      this.showRoomInfo = false;
    }
  }
  onRoomMovedToModelChange(traveller: Traveller, roomIndex: number) {
    for (let i = this.trip.rooms.length - 1; i >= 0; i--) {
      for (let j = this.trip.rooms[i].travellers.length - 1; j >= 0; j--) {
        if (this.trip.rooms[i].travellers[j].id === traveller.id) {
          this.trip.rooms[i].travellers.splice(j, 1);
        }
      }
    }

    for (let i = this.trip.rooms.length - 1; i >= 0; i--) {
      if (this.trip.rooms[i].index === roomIndex) {
        traveller.roomId = this.trip.rooms[i].id;
        this.trip.rooms[i].travellers.push(traveller);
      }
    }

    this.roomMovedTo.emit(true);
  }
}
