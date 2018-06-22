import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Location } from "@angular/common";
import { EnTourService } from "../en-tour.service";
import { Tour } from "../tour";
@Component({
  selector: "app-tour-detail",
  templateUrl: "./tour-detail.component.html",
  styleUrls: ["./tour-detail.component.sass"]
})
export class TourDetailComponent implements OnInit {
  @Input() tour: Tour;
  constructor(
    private activedRoute: ActivatedRoute,
    private tourService: EnTourService,
    private router: Router,
    private location: Location
  ) {}
  ngOnInit(): void {
    this.getTour();
  }
  getTour(): void {
    const id = +this.activedRoute.snapshot.paramMap.get("id");
    // this.tourService.getTour(id).then(tour => (this.tour = tour));
    this.tour = this.tourService.getTourMockData(id);
  }
  goBack(): void {
    this.location.back();
  }

  goToTraveller(id: number): void {
    // this.router.navigate(["/travellers", id]);
    this.router.navigate(["/travellers"]);
  }
}
