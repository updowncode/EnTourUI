import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { Room } from "../Models/room";
import { Trip } from "../Models/trip";
import { EnTourService } from "../en-tour.service";
import { Subscription } from "rxjs";
import { Tour } from "../Models/tour";

@Component({
  selector: "app-select-room",
  templateUrl: "./select-room.component.html",
  styleUrls: ["./select-room.component.sass"]
})
export class SelectRoomComponent implements OnInit, OnDestroy {
  @Input() room: Room;
  @Input() trip: Trip;
  @Input() roomIndex: number;
  @Output() roomCanbeMovedTo = new EventEmitter<boolean>();
  @Output() removeRoom = new EventEmitter<Room>();
  bedRoomsForSelectedTravellers: Room[];
  roomsMoveTo: Room[];
  availabledRooms: Room[] = [];
  capacities: number[];
  maxCapacity: number;

  subscription: Subscription;

  constructor(private tourService: EnTourService) {
    this.subscription = tourService.roomsCanbeMovedTo$.subscribe(
      updateRoomsCanbeMovedTo => {
        if (updateRoomsCanbeMovedTo) {
          this.updateRoomsCanbeMovedTo();
        }
      }
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.availabledRooms =  Object.assign([], this.trip.availabledRooms);
    // this.availabledRooms = Object.assign([], this.trip.availabledRooms);
    this.capacities = this.tourService.getRoomCapacities(this.availabledRooms);
    this.maxCapacity = Math.max(...this.capacities);
    this.updateRoomsCanbeMovedTo();
  }
  remove(room: Room) {
    this.removeRoom.emit(room);
  }
  onRoomMovedTo(moved: boolean) {
    this.roomCanbeMovedTo.emit(true);
  }
  onRoomChangedTo(changed: any) {
    for (let i = this.trip.rooms.length - 1; i >= 0; i--) {
      if (this.trip.rooms[i].index === changed.roomIndex) {
        changed.newRoom.index = this.trip.rooms[i].index;
        changed.newRoom.isSmokingRoom = this.trip.rooms[i].isSmokingRoom;
        this.trip.rooms[i] = Object.assign({}, changed.newRoom);
        break;
      }
    }
    this.tourService.updateRoomInfo();
  }
  updateRoomsCanbeMovedTo() {
    if (this.room !== undefined) {
      this.roomsMoveTo = new Array<Room>();
      this.roomsMoveTo.push(this.room);
      for (let i = 0; i < this.trip.rooms.length; i++) {
        let found = false;
        for (let j = 0; j < this.roomsMoveTo.length; j++) {
          if (this.roomsMoveTo[j].index === this.trip.rooms[i].index) {
            found = true;
            break;
          }
        }

        if (!found) {
          if (this.trip.rooms[i].travellers.length < this.maxCapacity) {
            this.roomsMoveTo.push(this.trip.rooms[i]);
          }
        }
      }
      this.bedRoomsForSelectedTravellers = Object.assign(
        [],
        this.tourService.getRoomsByTheTravellersInTheRoom(
          this.room.travellers,
          this.availabledRooms
        )
      );
    }
  }
}
