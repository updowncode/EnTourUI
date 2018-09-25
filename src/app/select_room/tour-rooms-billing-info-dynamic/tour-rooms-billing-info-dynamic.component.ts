import { Component, OnInit, Input } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";

@Component({
  selector: "app-tour-rooms-billing-info-dynamic",
  templateUrl: "./tour-rooms-billing-info-dynamic.component.html",
  styleUrls: ["./tour-rooms-billing-info-dynamic.component.sass"]
})
export class TourRoomsBillingInfoDynamicComponent implements OnInit {
  @Input()
  roomsFormGroup: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.roomsFormGroup.addControl(
      "firstName",
      this.fb.control("", Validators.required)
    );

    // this.roomsFormGroup.addControl(
    //   "firstName",
    //   new FormControl("", Validators.required)
    // ); // new FormControl({value:'jack', disabled:true})
  }
  //   this.name.valueChanges.subscribe(() => {
  //     // do something...
  //     console.log(this.name);
  // });
}
