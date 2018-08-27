import { Component, OnInit, Inject } from "@angular/core";
import {
  ActivatedRoute,
  Router,
  ParamMap,
  RoutesRecognized
} from "@angular/router";
import { Observable, of } from "rxjs";
import { EnTourService } from "../../en-tour.service";
import { Tour } from "../../Models/tour";
import { APP_BASE_HREF } from "@angular/common";
@Component({
  selector: "app-tour-list",
  templateUrl: "./tour-list.component.html",
  styles: [
    `
      mat-card {
        margin: 2em auto;
        text-align: center;
      }
    `
  ]
})
export class TourListComponent implements OnInit {
  tours$: Observable<Tour[]>;
  constructor(public tourService: EnTourService, @Inject(APP_BASE_HREF) public baseHref: string) {}

  ngOnInit() {
    this.tours$ = this.tourService.getToursAsync();
    this.tours$.subscribe(tours => {
      this.tourService.saveTours(tours);
    });
  }
}
