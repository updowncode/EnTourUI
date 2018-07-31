import { Component, OnInit, Input, HostBinding } from "@angular/core";
import { Traveller } from "../Models/traveller";
import { Room } from "../Models/room";
import { Trip } from "../Models/trip";
import { slideInDownAnimation } from "../animations";
import { EnTourService } from "../en-tour.service";

@Component({
  selector: "app-traveller-in-room",
  templateUrl: "./traveller-in-room.component.html",
  styleUrls: ["./traveller-in-room.component.sass"],
  animations: [slideInDownAnimation]
})
export class TravellerInRoomComponent implements OnInit {
  @HostBinding("@routeAnimation") routeAnimation = true;
  @HostBinding("style.display") display = "block";
  @HostBinding("style.position") position = "related";
  @Input() traveller: Traveller;
  @Input() room: Room;
  @Input() trip: Trip;
  @Input() roomIndex: number;
  selectedBedConfig: string;
  availabledBedConfigForSameRoomCapatity: string[] = [];
  showRoomInfo: boolean;
  availabledRooms: Room[];
  roomsNotFull: Room[];
  constructor(private tourService: EnTourService) {}

  ngOnInit() {
    this.availabledRooms = this.tourService.getRooms(
      this.room.tourId,
      this.room.tripId
    );
    this.initRoomInfo();
  }
  initRoomInfo() {
    if (this.traveller === this.room.travellers[0]) {
      this.showRoomInfo = true;
    } else {
      this.showRoomInfo = false;
    }
    if (this.room.capacity === this.room.travellers.length) {
      const roomsWithSameCapatity = new Array<Room>();
      for (let i = 0; i < this.availabledRooms.length; i++) {
        if (this.availabledRooms[i].capacity === this.room.capacity) {
          roomsWithSameCapatity.push(this.availabledRooms[i]);
        }
      }
      for (let i = 0; i < this.availabledRooms.length; i++) {
        if (
          this.availabledRooms[i].capacity === this.room.capacity &&
          this.availabledRooms[i].roomPrice ===
            Math.min(...roomsWithSameCapatity.map<number>(c => c.roomPrice))
        ) {
          this.selectedBedConfig = this.availabledRooms[i].beddingConfig;
        }
      }
      for (let i = 0; i < this.availabledRooms.length; i++) {
        if (this.availabledRooms[i].capacity === this.room.capacity) {
          if (
            this.availabledBedConfigForSameRoomCapatity.indexOf(
              this.availabledRooms[i].beddingConfig
            ) < 0
          ) {
            this.availabledBedConfigForSameRoomCapatity.push(
              this.availabledRooms[i].beddingConfig
            );
          }
        }
      }
    }
    if (this.room.travellers.length < this.room.capacity) {
      for (let k = 0; k < this.availabledRooms.length; k++) {
        if (this.availabledRooms[k].capacity > this.room.travellers.length) {
          const roomsWithSameCapatity = new Array<Room>();
          for (let i = 0; i < this.availabledRooms.length; i++) {
            if (this.availabledRooms[i].capacity === this.availabledRooms[k].capacity) {
              roomsWithSameCapatity.push(this.availabledRooms[i]);
            }
          }
          for (let i = 0; i < this.availabledRooms.length; i++) {
            if (
              this.availabledRooms[i].capacity === this.availabledRooms[k].capacity &&
              this.availabledRooms[i].roomPrice ===
                Math.min(...roomsWithSameCapatity.map<number>(c => c.roomPrice))
            ) {
              this.selectedBedConfig = this.availabledRooms[i].beddingConfig;
            }
          }
          for (let i = 0; i < this.availabledRooms.length; i++) {
            if (this.availabledRooms[i].capacity === this.availabledRooms[k].capacity) {
              if (
                this.availabledBedConfigForSameRoomCapatity.indexOf(
                  this.availabledRooms[i].beddingConfig
                ) < 0
              ) {
                this.availabledBedConfigForSameRoomCapatity.push(
                  this.availabledRooms[i].beddingConfig
                );
              }
            }
          }
          break;
        }
      }
    }
  }
  moveRoom(traveller: Traveller, roomIndex: number) {
    for (let i = this.trip.rooms.length - 1; i >= 0; i--) {
      for (let j = this.trip.rooms[i].travellers.length - 1; j >= 0; j--) {
        if (this.trip.rooms[i].travellers[j].id === traveller.id) {
          this.trip.rooms[i].travellers.splice(j, 1);
        }
      }
    }

    for (let i = this.trip.rooms.length - 1; i >= 0; i--) {
      if (this.trip.rooms[i].index === roomIndex) {
        this.trip.rooms[i].travellers.push(traveller);
      }
    }

    this.initRoomInfo();
  }
}
