import { Component, OnInit, Input } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl
} from "@angular/forms";
import { Trip } from "../../Models/trip";
import { Tour } from "../../Models/tour";
export function countryValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    return control.value.id === -1 ? {'required': {value: control.value}} : null;
  };
}
@Component({
  selector: "app-tour-rooms-billing-info-dynamic",
  templateUrl: "./tour-rooms-billing-info-dynamic.component.html",
  styleUrls: ["./tour-rooms-billing-info-dynamic.component.sass"]
})
export class TourRoomsBillingInfoDynamicComponent implements OnInit {
  @Input()
  roomsFormGroup: FormGroup;
  @Input()
  trip: Trip;
  @Input()
  tour: Tour;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.tour.availabledCountryOrAreas = [
      { id: -1, code: "", name: "Select" },
      ...this.tour.availabledCountryOrAreas
    ];
    this.trip.billingInfo.country = this.tour.availabledCountryOrAreas[0];
   // this.trip.billingInfo.country = this.tour.availabledCountryOrAreas.find( c => c.code === 'CA');
    this.initControls();
  }
  initControls() {
    this.roomsFormGroup.addControl(
      "firstName",
      this.fb.control("", Validators.required)
    );
    this.roomsFormGroup.addControl(
      "lastName",
      this.fb.control("", Validators.required)
    );
    this.roomsFormGroup.addControl(
      "email",
      this.fb.control("", Validators.required)
    );
    this.roomsFormGroup.addControl(
      "primaryPhone",
      this.fb.control("", Validators.required)
    );
    this.roomsFormGroup.addControl("secondaryPhone", this.fb.control(""));
    this.roomsFormGroup.addControl(
      "mailingAddress",
      this.fb.control("", Validators.required)
    );
    this.roomsFormGroup.addControl(
      "city",
      this.fb.control("", Validators.required)
    );
    this.roomsFormGroup.addControl(
      "country",
      this.fb.control(this.tour.availabledCountryOrAreas.find( c => c.id === -1), [Validators.required, countryValidator()])
    );
    this.roomsFormGroup.addControl(
      "provinceStates",
      this.fb.control("", Validators.required)
    );
    this.roomsFormGroup.addControl(
      "postalCode",
      this.fb.control("", Validators.required)
    );

    // this.roomsFormGroup.addControl(
    //   "firstName",
    //   new FormControl("", Validators.required)
    // ); // new FormControl({value:'jack', disabled:true})
    //   this.name.valueChanges.subscribe(() => {
    //     // do something...
    //     console.log(this.name);
    // });
  }
}
