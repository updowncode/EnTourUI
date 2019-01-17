import { Component, OnInit, Input } from "@angular/core";
import { Trip } from "../../Models/trip";

@Component({
  selector: "app-trip-details",
  templateUrl: "./trip-details.component.html",
  styles: [" .interp { div p: 'margin-bottom:0px;'}"]
})
export class TripDetailsComponent {
  @Input()
  trip: Trip;
}
