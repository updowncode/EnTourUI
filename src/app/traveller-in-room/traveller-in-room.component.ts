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
  @HostBinding("@routeAnimation")
  routeAnimation = true;
  @HostBinding("style.display")
  display = "block";
  @HostBinding("style.position")
  position = "related";
  @Input()
  traveller: Traveller;
  @Input()
  room: Room;
  @Input()
  trip: Trip;
  @Input()
  roomIndex: number;
  @Input()
  roomsMoveTo: Room[];
  @Input()
  bedRoomsForSelectedTravellers: Room[];
  @Output()
  roomMovedTo = new EventEmitter<boolean>();
  @Output()
  roomChangedTo = new EventEmitter<any>();
  showRoomInfo: boolean;
  availabledRooms: Room[] = [];
  newBedRoom: Room;
  subscription: Subscription;

  constructor(private tourService: EnTourService) {}
  ngOnDestroy() {}
  ngOnInit() {
    this.availabledRooms = Object.assign([], this.trip.availabledRooms);
    this.updateRoomInfo();
  }
  onBedConfigModelChange(roomIndex: number, newRoom: Room) {
    this.roomChangedTo.emit({ roomIndex: roomIndex, newRoom: newRoom });
  }
  onSmokingSelectionChange(room: Room, isSmokingRoom: number) {
    room.isSmokingRoom = isSmokingRoom;
  }
  updateRoomInfo() {
    if (
      this.traveller !== undefined &&
      this.traveller === this.room.travellers[0]
    ) {
      this.showRoomInfo = true;
      this.reSortBedConfig();
      this.newBedRoom = this.bedRoomsForSelectedTravellers[0];
    } else {
      this.showRoomInfo = false;
    }
  }
  reSortBedConfig() {
    const newBedRoomsForSelectedTravellers: Room[] = [];
    for (let j = 0; j < this.bedRoomsForSelectedTravellers.length; j++) {
      if (this.bedRoomsForSelectedTravellers[j].id === this.room.id) {
        newBedRoomsForSelectedTravellers.push(
          this.bedRoomsForSelectedTravellers[j]
        );
        break;
      }
    }
    for (let j = 0; j < this.bedRoomsForSelectedTravellers.length; j++) {
      if (this.bedRoomsForSelectedTravellers[j].id !== this.room.id) {
        newBedRoomsForSelectedTravellers.push(
          this.bedRoomsForSelectedTravellers[j]
        );
      }
    }
    this.bedRoomsForSelectedTravellers = Object.assign(
      [],
      newBedRoomsForSelectedTravellers
    );
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
