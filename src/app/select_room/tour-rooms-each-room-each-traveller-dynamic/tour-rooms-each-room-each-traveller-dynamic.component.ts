import { Component, OnInit, Input, ContentChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Trip } from "../../Models/trip";
import { TourRoomsEachRoomEachTravellerChildDynamicComponent } from "../tour-rooms-each-room-each-traveller-child-dynamic/tour-rooms-each-room-each-traveller-child-dynamic.component";
import { Room } from "../../Models/room";

@Component({
  selector: "app-tour-rooms-each-room-each-traveller-dynamic",
  templateUrl: "./tour-rooms-each-room-each-traveller-dynamic.component.html",
  styleUrls: ["./tour-rooms-each-room-each-traveller-dynamic.component.sass"]
})
export class TourRoomsEachRoomEachTravellerDynamicComponent implements OnInit {
  @Input()
  travellerControl: FormGroup;
  @Input()
  trip: Trip;
  @Input()
  roomIndex: number;
  @Input()
  bedRoomsForSelectedTravellers: Room[];
  @ContentChild(TourRoomsEachRoomEachTravellerChildDynamicComponent)
  contentChild: TourRoomsEachRoomEachTravellerChildDynamicComponent;
  constructor() {}
  onRoomSelectedChange(room: number) {
    console.log(room);
  }
  onBedSelectedChange(bed: number) {
    console.log(bed);
  }
  ngOnInit() {}
}
