import { Component, OnInit, Input } from "@angular/core";
import { Tour } from "../Models/tour";
import { Trip } from "../Models/trip";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.sass"]
})
export class NavBarComponent implements OnInit {
  @Input() actived: number;
  tourId: number;
  tripId: number;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.tourId = +this.activatedRoute.snapshot.queryParamMap.get("tourId");
    this.tripId = +this.activatedRoute.snapshot.queryParamMap.get("tripId");
  }
}
