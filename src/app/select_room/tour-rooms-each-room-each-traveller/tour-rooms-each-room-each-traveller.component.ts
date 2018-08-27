import {
  Component,
  OnInit,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { Traveller } from "../../Models/traveller";
import { Room } from "../../Models/room";
import { Trip } from "../../Models/trip";
import { slideInDownAnimation } from "../../app.animations";
import { EnTourService } from "../../en-tour.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-tour-rooms-each-room-each-traveller',
  templateUrl: './tour-rooms-each-room-each-traveller.component.html',
  styleUrls: ['./tour-rooms-each-room-each-traveller.component.sass'],
  animations: [slideInDownAnimation]
})
export class TourRoomsEachRoomEachTravellerComponent implements OnInit {
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
  newBedRoom: Room;
  subscription: Subscription;

  ngOnInit() {
    this.updateRoomInfo();
  }
  onBedConfigModelChange(roomIndex: number, newRoom: Room) {
    this.roomChangedTo.emit({ roomIndex: roomIndex, newRoom: newRoom });
  }
  onSmokingSelectionChange(room: Room, smokingRoom: number) {
    room.smokingRoom = smokingRoom;
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
    for (let i = 0; i < this.trip.rooms.length; i++) {
      for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
        this.trip.rooms[i].travellers[j].id =
          this.totalTravellersBeforeRoom(i) + j;
      }
    }

    this.roomMovedTo.emit(true);
  }
  totalTravellersBeforeRoom(index: number): number {
    let total = 0;
    if (index > 0) {
      for (let i = 0; i < index; i++) {
        for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
          total++;
        }
      }
    }
    return total;
  }
}

