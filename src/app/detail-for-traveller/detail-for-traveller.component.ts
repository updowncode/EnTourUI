import {
  Component,
  OnInit,
  Input,
  HostBinding,
  AfterViewChecked
} from "@angular/core";
import { Traveller } from "../Models/traveller";
import { CountryOrArea } from "../Models/countryorarea";
import { Trip } from "../Models/trip";
import { Tour } from "../Models/tour";
import { slideInDownAnimation } from "../animations";
import { ActivatedRoute, Router } from "@angular/router";
import { EnTourService } from "../en-tour.service";
import * as $ from "jquery";
// import {MyDatePickerComponent} from '../my-date-picker/my-date-picker.component';
@Component({
  selector: "app-detail-for-traveller",
  templateUrl: "./detail-for-traveller.component.html",
  styleUrls: ["./detail-for-traveller.component.sass"],
  // directives: [MyDatePickerComponent],
  animations: [slideInDownAnimation]
})
export class DetailForTravellerComponent implements OnInit, AfterViewChecked {
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
  minDateForDOBForPassportIssue: any;
  maxDateForDOBForPassportIssue: any;
  minDateForDOBForPassportExpiry: any;
  maxDateForDOBForPassportExpiry: any;

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

    this.traveller.countryorarea = this.availabledCountryOrAreas[0];
    this.traveller.passport.issuePlace = this.availabledCountryOrAreas[0];
    this.traveller.title = this.availabledTitles[0];
    this.minDateForDOB = {
      year: new Date().getFullYear() - 100,
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
    this.maxDateForDOB = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };

    this.minDateForDOBForPassportIssue = {
      year: new Date().getFullYear() - 20,
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
    this.maxDateForDOBForPassportIssue = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
    this.minDateForDOBForPassportExpiry = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
    this.maxDateForDOBForPassportExpiry = {
      year: new Date().getFullYear() + 100,
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
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
