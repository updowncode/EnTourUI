import { Component, OnInit, Input } from "@angular/core";
import { Traveller } from "../Models/traveller";
import { Room } from "../Models/room";

@Component({
  selector: "app-traveller-in-room",
  templateUrl: "./traveller-in-room.component.html",
  styleUrls: ["./traveller-in-room.component.sass"]
})
export class TravellerInRoomComponent implements OnInit {
  @Input() traveller: Traveller;
  @Input() room: Room;
  @Input() tripRooms: Room[];
  showRoomInfo: boolean;
  constructor() {}

  ngOnInit() {
    if (this.traveller === this.room.travellers[0]) {
      this.showRoomInfo = true;
    } else {
      this.showRoomInfo = false;
    }
  }
}
