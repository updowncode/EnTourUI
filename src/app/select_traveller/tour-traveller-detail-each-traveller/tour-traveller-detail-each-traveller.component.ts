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
  selector: 'app-tour-traveller-detail-each-traveller',
  templateUrl: './tour-traveller-detail-each-traveller.component.html',
  styleUrls: ['./tour-traveller-detail-each-traveller.component.sass'],
  // directives: [MyDatePickerComponent],
  animations: [slideInDownAnimation]
})
export class TourTravellerDetailEachTravellerComponent implements OnInit, AfterViewChecked {
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

    this.minDateForPassportIssue = {
      year: new Date().getFullYear() - 20,
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
    this.maxDateForPassportIssue = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
    this.minDateForPassportExpiry = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
    this.maxDateForPassportExpiry = {
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
