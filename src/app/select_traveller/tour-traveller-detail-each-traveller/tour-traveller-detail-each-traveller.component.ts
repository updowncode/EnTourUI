import {
  Component,
  OnInit,
  Input,
  HostBinding,
  AfterViewChecked
} from "@angular/core";
import { Traveller } from "../../Models/traveller";
import { CountryOrArea } from "../../Models/countryorarea";
import { Trip } from "../../Models/trip";
import { Tour } from "../../Models/tour";
import { slideInDownAnimation } from "../../app.animations";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../../en-tour.service";
import * as $ from "jquery";
// import {MyDatePickerComponent} from '../my-date-picker/my-date-picker.component';
@Component({
  selector: "app-tour-traveller-detail-each-traveller",
  templateUrl: "./tour-traveller-detail-each-traveller.component.html",
  styleUrls: ["./tour-traveller-detail-each-traveller.component.sass"],
  // styles: [
  //   `
  //     :host {
  //       z-index: 1 !important;
  //     }
  //   `
  // ],
  // directives: [MyDatePickerComponent],
  animations: [slideInDownAnimation]
})
export class TourTravellerDetailEachTravellerComponent
  implements OnInit, AfterViewChecked {
  @HostBinding("@routeAnimation")
  routeAnimation = true;
  @HostBinding("style.display")
  display = "block";
  @HostBinding("style.position")
  position = "related";
  msg = "Loading traveller's details ...";
  @Input()
  traveller: Traveller;
  @Input()
  index: number;
  @Input()
  availabledCountryOrAreas: CountryOrArea[];
  @Input()
  availabledTitles: string[];
  minDateForDOB: any;
  maxDateForDOB: any;
  minDateForPassportExpiry: any;
  maxDateForPassportExpiry: any;
  minDateForPassportIssue: any;
  maxDateForPassportIssue: any;
  ngAfterViewChecked() {}
  // selectedDate: any = "";
  // private myDatePickerOptions = {
  //   todayBtnTxt: "Today",
  //   dateFormat: "yyyy-mm-dd",
  //   firstDayOfWeek: "mo",
  //   sunHighlight: true,
  //   height: "134px",
  //   width: "300px",

  //   background: "#3BAFDA",
  //   showTextBox: false
  // };

  constructor() {}

  ngOnInit() {
    this.availabledCountryOrAreas = [
      { id: -1, code: "", name: "" },
      ...this.availabledCountryOrAreas
    ];
    this.availabledTitles = ["", ...this.availabledTitles];
    if (this.traveller.countryorarea.id < 0) {
      this.traveller.countryorarea = this.availabledCountryOrAreas[0];
    }
    if (this.traveller.passport.issuePlace.id < 0) {
      this.traveller.passport.issuePlace = this.availabledCountryOrAreas[0];
    }
    if (this.traveller.title === "") {
      this.traveller.title = this.availabledTitles[0];
    }
    this.minDateForDOB = new Date(1901, 0, 1); // 1901-01-01
    // {
    //   year: new Date().getFullYear() - 100,
    //   month: new Date().getMonth() + 1,
    //   day: new Date().getDate()
    // };
    this.maxDateForDOB = new Date();
    // {
    //   year: new Date().getFullYear(),
    //   month: new Date().getMonth() + 1,
    //   day: new Date().getDate()
    // };

    this.minDateForPassportIssue = new Date(new Date().getFullYear() - 20, 0, 1);
    // {
    //   year: new Date().getFullYear() - 20,
    //   month: new Date().getMonth() + 1,
    //   day: new Date().getDate()
    // };
    this.maxDateForPassportIssue = new Date();
    // {
    //   year: new Date().getFullYear(),
    //   month: new Date().getMonth() + 1,
    //   day: new Date().getDate()
    // };
    this.minDateForPassportExpiry = new Date();
    // {
    //   year: new Date().getFullYear(),
    //   month: new Date().getMonth() + 1,
    //   day: new Date().getDate()
    // };
    this.maxDateForPassportExpiry = new Date(new Date().getFullYear() + 100, 0, 1);
    // {
    //   year: new Date().getFullYear() + 100,
    //   month: new Date().getMonth() + 1,
    //   day: new Date().getDate()
    // };
  }

  compareTitle(c1: string, c2: string): boolean {
    return c1 && c2 ? c1 === c2 : false;
  }
  compareCountry(c1: CountryOrArea, c2: CountryOrArea): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  //
  // // Date Picker //

  // onDateChanged1(event) {
  //   console.log(
  //     "onDateChanged1(): ",
  //     event.date,
  //     " - formatted: ",
  //     event.formatted,
  //     " - epoc timestamp: ",
  //     event.epoc
  //   );
  //   this.selectedDate = event.formatted;
  // }
  // Date Picker //
}
