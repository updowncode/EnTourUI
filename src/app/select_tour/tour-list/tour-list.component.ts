import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import {
  ActivatedRoute,
  Router,
  ParamMap,
  RoutesRecognized
} from "@angular/router";
import { Observable, of, Subscription } from "rxjs";
import { EnTourService } from "../../en-tour.service";
import { Tour } from "../../Models/tour";
import { APP_BASE_HREF } from "@angular/common";
import { MessageService } from "../../message.service";

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
export class TourListComponent implements OnInit, OnDestroy {
  loaded = false;
  tours$: Observable<Tour[]>;
  toursSubscription: Subscription;
  constructor(
    public tourService: EnTourService,
    @Inject(APP_BASE_HREF) public baseHref: string,
    public messageService: MessageService
  ) {}

  ngOnDestroy() {
    this.toursSubscription.unsubscribe();
  }
  ngOnInit() {
    this.tours$ = this.tourService.getToursAsync();
    this.toursSubscription = this.tours$.subscribe(tours => {
      this.loaded = true;
      this.tourService.saveTours(tours);
    });
    window.scrollTo(0, 0);
  }
}
