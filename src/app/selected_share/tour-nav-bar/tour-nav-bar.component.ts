import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-tour-nav-bar',
  templateUrl: './tour-nav-bar.component.html',
  styleUrls: ['./tour-nav-bar.component.sass']
})
export class TourNavBarComponent implements OnInit {
  @Input() actived: number;
  tourId: string;
  tripId: string;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.tourId = this.activatedRoute.snapshot.queryParamMap.get("tourId");
    this.tripId = this.activatedRoute.snapshot.queryParamMap.get("tripId");
  }
}
