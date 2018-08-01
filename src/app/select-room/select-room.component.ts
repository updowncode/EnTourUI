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

@Component({
  selector: "app-select-room",
  templateUrl: "./select-room.component.html",
  styleUrls: ["./select-room.component.sass"]
})
export class SelectRoomComponent implements OnInit, OnDestroy {
  @Input() room: Room;
  @Input() trip: Trip;
  @Input() roomIndex: number;
  @Output() updateRoomsList = new EventEmitter<boolean>();
  roomsMoveTo: Room[];
  availabledRooms: Room[];
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
    this.availabledRooms = this.tourService.getRooms(
      this.trip.tourId,
      this.trip.id
    );
    this.capacities = this.tourService.getRoomCapacities(this.availabledRooms);
    this.maxCapacity = Math.max(...this.capacities);
    this.updateRoomsCanbeMovedTo();
  }
  onTravellerMoved(moved: boolean) {
    this.updateRoomsList.emit(true);
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
    }
  }
}
