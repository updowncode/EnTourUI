import { Component, OnInit, Input, Inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { APP_BASE_HREF } from '@angular/common';
@Component({
  selector: 'app-tour-nav-bar',
  templateUrl: './tour-nav-bar.component.html',
  styleUrls: ['./tour-nav-bar.component.sass']
})
export class TourNavBarComponent implements OnInit {
  @Input() actived: number;
  tourId: string;
  tripId: string;
  constructor(private activatedRoute: ActivatedRoute, @Inject(APP_BASE_HREF) public baseHref: string) {}

  ngOnInit() {
    // this.tourId = this.activatedRoute.snapshot.paramMap.get("id");
    this.tourId = this.activatedRoute.snapshot.queryParamMap.get("tourId");
    this.tripId = this.activatedRoute.snapshot.queryParamMap.get("tripId");
  }
}
