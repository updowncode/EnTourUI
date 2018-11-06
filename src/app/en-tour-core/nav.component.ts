import { Component, OnInit } from "@angular/core";
import { EnTourCoreService } from "./en-tour-core.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.sass"]
})
export class NavComponent {
  constructor(private coreService: EnTourCoreService) {}
  // constructor() {}
}
