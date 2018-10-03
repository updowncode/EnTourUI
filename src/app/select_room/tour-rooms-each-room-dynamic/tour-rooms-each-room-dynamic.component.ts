import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, FormControl } from "@angular/forms";
import { forEach } from "@angular/router/src/utils/collection";
import { Trip } from "../../Models/trip";

@Component({
  selector: "app-tour-rooms-each-room-dynamic",
  templateUrl: "./tour-rooms-each-room-dynamic.component.html",
  styleUrls: ["./tour-rooms-each-room-dynamic.component.sass"]
})
export class TourRoomsEachRoomDynamicComponent implements OnInit, OnChanges {
  @Input()
  roomControl: FormGroup;
  @Input()
  trip: Trip;
  @Input()
  roomIndex: number;
  @Input()
  bedsCanbeSelected;
  maxCapacity: number;
  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.maxCapacity = Math.max(
      ...this.trip.availabledRooms
        .filter(room => room.capacity > 0)
        .map(room => room.capacity)
    );


  }
  addTraveller() {
    (<FormArray>this.roomControl.get("travellers")).push(
      this.fb.group({
        firstName: ["3333"],
        lastName: [""],
        roomToSelect: [""],
        bedToSelect: [""],
        showRoomInfo: false
      })
    );
    this.firstNameChange();
  }
  remove(roomIndex: number) {
    (<FormArray>this.roomControl.parent).removeAt(roomIndex);
  }
  ngOnChanges() {
    // this.heroForm.reset();
    // this.heroForm.setValue({
    //   name: this.hero.name,
    //   address: this.hero.addresses[0] || new Address()
    // });
  }
  firstNameChange() {
    // const travellerControls = <FormArray>this.roomControl.get("travellers");
    // for (let i = 0; i < travellerControls.length; i++) {
    //   const nameControl = travellerControls[i] as FormGroup;
    //   nameControl.get("firstName").valueChanges.forEach((v: string) =>
    //     (<FormArray>this.roomControl.get("travellers")).push(
    //       this.fb.group({
    //         firstName: ["3tttt"]
    //       })
    //     )
    //   );
    // }
  }
}
