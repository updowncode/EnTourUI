import { Component, OnInit } from "@angular/core";

import { EnTourService } from "../en-tour.service";
import { Tour } from "../tour";
@Component({
  selector: "app-tour-list",
  templateUrl: "./tour-list.component.html",
  styleUrls: ["./tour-list.component.sass"]
})
export class TourListComponent implements OnInit {
  tours: Tour[] = [];
  constructor(private tourService: EnTourService) {}

  ngOnInit() {
   // this.tourService.getTours().then(tours => this.tours = tours);
   this.tours = this.tourService.getToursMockData();
  }

}
