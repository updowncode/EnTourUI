import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  AfterViewChecked
} from "@angular/core";
import { Room } from "../../Models/room";
import { Trip } from "../../Models/trip";
import { EnTourService } from "../../en-tour.service";
import { Subscription } from "rxjs";
import { Tour } from "../../Models/tour";

// tslint:disable-next-line:max-line-length
import { TourRoomsEachRoomEachTravellerComponent } from "../tour-rooms-each-room-each-traveller/tour-rooms-each-room-each-traveller.component";
import { RoomCfg } from "src/app/Models/room-cfg";

@Component({
  selector: "app-tour-rooms-each-room",
  templateUrl: "./tour-rooms-each-room.component.html",
  styleUrls: ["./tour-rooms-each-room.component.sass"]
  // // tslint:disable-next-line:use-input-property-decorator
  // inputs: ['room'],
  // // tslint:disable-next-line:use-output-property-decorator
  // outputs: ['roomCanbeMovedToRequest'],
})
export class TourRoomsEachRoomComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input()
  room: Room;
  @Input()
  trip: Trip;
  @Input()
  roomIndex: number;
  @Output()
  roomCanbeMovedToRequest = new EventEmitter<boolean>();
  @Output()
  removeRoom = new EventEmitter<Room>();
  bedRoomsForSelectedTravellers: Room[];
  roomsMoveTo: Room[];
  capacities: number[];
  maxCapacity: number;
  @ViewChild(TourRoomsEachRoomEachTravellerComponent)
  eachTravellerView: TourRoomsEachRoomEachTravellerComponent;
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
  compareFn(c1: RoomCfg, c2: RoomCfg): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  ngOnInit() {
    this.maxCapacity = Math.max(
      ...this.trip.availabledRooms
        .filter(room => room.capacity > 0)
        .map(room => room.capacity)
    );
    this.updateRoomsCanbeMovedTo();
  }
  ngAfterViewInit(): void {
    // 初始化完组件视图及其子视图之后调用。第一次 ngAfterContentChecked() 之后调用，只调用一次。
    if (this.room.index > 0) {
      console.log(`ngAfterViewInit:room index is ${this.room.index}`);
    }
  }
  ngAfterViewChecked(): void {
    // 每次做完组件视图和子视图的变更检测之后调用。ngAfterViewInit() 和每次 ngAfterContentChecked() 之后调用。
    if (this.room.index > 0) {
      console.log(`ngAfterViewChecked:room index is ${this.room.index}`);
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  remove(room: Room) {
    this.removeRoom.emit(room);
  }
  onRoomMovedTo(moved: boolean) {
    this.roomCanbeMovedToRequest.emit(true);
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
  onSmokingSelectionChange(room: Room, smokingRoom: number) {
    room.smokingRoom = smokingRoom;
  }
  addExtraHotelQuantity(room: Room) {
    room.extraHotelQuantity++;
    this.tourService.updateRoomInfo();
  }
  minusExtraHotelQuantity(room: Room) {
    room.extraHotelQuantity--;
    this.tourService.updateRoomInfo();
  }
  displayRoomInfo(): string {
    return `Total Rooms: ${this.trip.rooms.length} RoomId:${
      this.room.id
    } Travellers: ${this.room.travellers.length} Room Capacity: ${
      this.room.capacity
    }`;
  }
}
