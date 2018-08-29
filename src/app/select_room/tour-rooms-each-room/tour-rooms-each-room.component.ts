import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { Room } from "../../Models/room";
import { Trip } from "../../Models/trip";
import { EnTourService } from "../../en-tour.service";
import { Subscription } from "rxjs";
import { Tour } from "../../Models/tour";

@Component({
  selector: "app-tour-rooms-each-room",
  templateUrl: "./tour-rooms-each-room.component.html",
  styleUrls: ["./tour-rooms-each-room.component.sass"]
})
export class TourRoomsEachRoomComponent implements OnInit, OnDestroy {
  @Input()
  room: Room;
  @Input()
  trip: Trip;
  @Input()
  roomIndex: number;
  @Output()
  roomCanbeMovedTo = new EventEmitter<boolean>();
  @Output()
  removeRoom = new EventEmitter<Room>();
  bedRoomsForSelectedTravellers: Room[];
  roomsMoveTo: Room[];
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
    this.maxCapacity = Math.max(
      ...this.trip.availabledRooms
        .filter(room => room.capacity > 0)
        .map(room => room.capacity)
    );
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
        changed.newRoom.smokingRoom = this.trip.rooms[i].smokingRoom;
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
        const notFound =
          this.roomsMoveTo.filter(c => c.index === this.trip.rooms[i].index)
            .length <= 0;
        if (
          notFound &&
          this.trip.rooms[i].travellers.length < this.maxCapacity
        ) {
          this.roomsMoveTo.push(this.trip.rooms[i]);
        }
      }
      this.bedRoomsForSelectedTravellers = Object.assign(
        [],
        this.tourService.getRoomsByTheTravellersInTheRoom(
          this.room.travellers,
          this.trip.availabledRooms
        )
      );
    }
  }
  displayRoomInfo(): string {
    return `Total Rooms: ${this.trip.rooms.length} RoomId:${
      this.room.id
    } Travellers: ${this.room.travellers.length} Room Capacity: ${
      this.room.capacity
    }`;
  }
}
