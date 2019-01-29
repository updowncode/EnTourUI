import {
  Component,
  OnInit,
  HostBinding,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { map, delay, switchMap, catchError, tap, retry } from "rxjs/operators";
// import { EnTourCoreService } from "../../en-tour-core/en-tour-core.service";
import { EnTourService } from "../../en-tour.service";
import { slideInDownAnimation } from "../../app.animations";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Tour } from "../../Models/tour";
import { Trip } from "../../Models/trip";
import { Traveller } from "../../Models/traveller";
import { Quantity } from "../../Models/quantity";
import { Room } from "../../Models/room";
import { Passport } from "../../Models/passport";
import { CountryOrArea } from "../../Models/countryorarea";
import { Subscription } from "rxjs";
import { Location } from "@angular/common";
import { MessageService } from "../../message.service";
import { TourDateType } from "../../Models/dateType";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbdModalContent } from "../../ngbd-model-content/ngbd-model-content";

import {
  Form,
  NgForm,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray
} from "@angular/forms";
interface RoomInfo {
  firstName: string;
}
@Component({
  selector: "app-tour-rooms-dynamic",
  templateUrl: "./tour-rooms-dynamic.component.html",
  styleUrls: ["./tour-rooms-dynamic.component.sass"]
})
export class TourRoomsDynamicComponent implements OnInit, OnChanges, OnDestroy {
  // @HostBinding("@routeAnimation")
  // routeAnimation = true;
  // @HostBinding("style.display")
  // display = "block";
  // @HostBinding("style.position")
  // position = "related";
  trip: Trip;
  tour: Tour;
  tourId: string;
  tripId: string;
  paramSubscription: Subscription;
  toursSubscription: Subscription;
  maxCapacity: number;
  isVerified: boolean;
  roomsForm: FormGroup;

  constructor(
    private tourService: EnTourService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    // this.location.replaceState("/");
  }
  ngOnInit() {
    this.isVerified = false;
    // this.messageService.add("Select room..");
    this.paramSubscription = this.activatedRoute.queryParams.subscribe(
      params => {
        this.tourId = params.tourId;
        this.tripId = params.tripId;
        this.toursSubscription = this.tourService
          .getToursAsync()
          .subscribe((tours: Tour[]) => this.onResult(tours));
      }
    );
  }
  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
    this.toursSubscription.unsubscribe();
  }
  onResult(tours: Tour[]) {
    this.tour = Object.assign({}, tours.find(tour => tour.id === this.tourId));
    this.trip = this.tour.trips.find(trip => trip.id === this.tripId);
    this.tourService.updateSelectedTour(this.tour);
    this.tourService.updateSelectedTrip(this.trip);
    this.maxCapacity = Math.max(
      ...this.trip.availabledRooms.map(room => room.capacity)
    );
    if (this.trip.rooms.length === 0) {
      // this.initRooms();
      this.initForm();
      this.tourService.updateRoomInfo();
    }
  }
  defaultRoomQuantity(
    selectedTravellerQuantity: Quantity,
    availabledRoomQuantities: Quantity[]
  ): Quantity {
    let pointer = 0;
    if (selectedTravellerQuantity.id > this.maxCapacity) {
      let remained = selectedTravellerQuantity.id;
      do {
        pointer++;
        remained -= this.maxCapacity;
      } while (remained > this.maxCapacity);
    }
    return availabledRoomQuantities[pointer];
  }
  get roomComponents(): FormArray {
    return this.roomsForm.get("roomComponents") as FormArray;
  }
  initForm() {
    this.trip.selectedTravellerQuantity = this.trip.availabledTravellerQuantities[
      this.trip.tripCostForDefaultTravellerQuantity - 1
    ];
    this.trip.selectedRoomQuantity = this.defaultRoomQuantity(
      this.trip.selectedTravellerQuantity,
      this.trip.availabledRoomQuantities
    );
    //   if (this.editingStatus) {
    //     this.trip = this.trips.getTrip()
    //     this.initForm(this.trip)
    // } else { //
    //     this.initForm()
    // }
    // this.assignForm(
    //   this.trip.selectedTravellerQuantity.id,
    //   this.trip.selectedRoomQuantity.id
    // );
    // enum Color { Red , Green };
    // let c: Color = Color.Red;
    this.roomsForm = this.fb.group({
      roomComponents: this.fb.array([])
    });
    const roomComponentControls = <FormArray>(
      this.roomsForm.controls.roomComponents
    );
    for (let i = 0; i < this.trip.selectedRoomQuantity.id; i++) {
      roomComponentControls.push(
        this.fb.group({
          roomIndex: [i + 1],
          travellers: this.fb.array([])
        })
      );
    }

    roomComponentControls.controls.forEach((room, roomIndex) => {
      room.get("roomIndex");
    });
    if (this.trip.selectedTravellerQuantity.id < this.maxCapacity) {
      const travellerListControls = new FormArray([]);
      for (let i = 0; i < this.trip.selectedTravellerQuantity.id; i++) {
        travellerListControls.push(
          this.fb.group({
            firstName: [""],
            lastName: [""],
            roomToSelect: [""],
            bedToSelect: [""],
            showRoomInfo: true
          })
        );
      }

      const travellerGroup = <FormGroup>(
        roomComponentControls.controls[
          roomComponentControls.controls.length - 1
        ]
      );
      const travellerControls = <FormArray>travellerGroup.get("travellers");
      travellerControls.push(
        this.fb.group({
          firstName: [""],
          lastName: [""],
          roomToSelect: [""],
          bedToSelect: [""],
          showRoomInfo: true
        })
      );
      travellerControls.push(
        this.fb.group({
          firstName: ["24234"],
          lastName: [""],
          roomToSelect: [""],
          bedToSelect: [""],
          showRoomInfo: false
        })
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    //   this.roomsForm.setValue({
    //     firstName:  this.trip.name
    //    });
  }

  initRooms() {
    this.trip.selectedTravellerQuantity = this.trip.availabledTravellerQuantities[
      this.trip.tripCostForDefaultTravellerQuantity - 1
    ];
    this.trip.selectedRoomQuantity = this.defaultRoomQuantity(
      this.trip.selectedTravellerQuantity,
      this.trip.availabledRoomQuantities
    );
    this.clearRooms();
    this.assignRoom(
      this.trip.selectedTravellerQuantity.id,
      this.trip.selectedRoomQuantity.id
    );
    this.trip.minRoomQuantityForTravellers = this.trip.rooms.length;
    this.tourService.updateRoomInfo();
  }

  clearRooms() {
    this.trip.rooms = new Array<Room>();
    // this.trip.rooms = this.trip.rooms.slice();
  }
  onRoomCanbeMovedTo(needUpdate: boolean) {
    if (needUpdate) {
      for (let i = 0; i < this.trip.rooms.length; i++) {
        const rooms = Object.assign(
          [],
          this.tourService.getRoomsByTheTravellersInTheRoom(
            this.trip.rooms[i].travellers,
            this.trip.availabledRooms
          )
        );
        this.trip.rooms[i] = Object.assign({}, rooms[0]);
      }
      this.tourService.updateRoomsCanbeMovedTo();
      this.assignRoomIndex();
      this.tourService.updateRoomInfo();
    }
  }
  onRemoveRoom(room: Room) {
    this.trip.rooms = this.trip.rooms.filter(r => r.index !== room.index);
    this.trip.selectedRoomQuantity = this.trip.availabledRoomQuantities.filter(
      r => r.id === this.trip.rooms.length
    )[0];
    // for (let i = this.trip.rooms.length - 1; i >= 0; i--) {
    //   if (this.trip.rooms[i].index === room.index) {
    //     this.trip.rooms.splice(i, 1);
    //   }
    // }
    this.tourService.updateRoomsCanbeMovedTo();
    this.assignRoomIndex();
  }
  assignForm(remainedTravellers: number, roomQuantity: number) {
    //   if(!trip) { // Creating a trip
    //     this.addCity();
    //     this.addPlace(0);
    // } else { // Editing a trip
    //     trip.cities.forEach((city, cityIndex) => {
    //       this.addCity(city);
    //       city.places.forEach((place, placeIndex) =>{
    //         this.addPlace(cityIndex, place);
    //       })
    //     })
    // }
    if (remainedTravellers <= this.maxCapacity) {
      this.roomsForm = this.fb.group({
        roomComponents: this.fb.array([])
      });
      const roomComponentControls = <FormArray>(
        this.roomsForm.controls.roomComponents
      );
      roomComponentControls.push(
        this.fb.group({
          roomIndex: ["2342"],
          travellers: this.fb.array([])
        })
      );
      const travellerGroup = <FormGroup>(
        roomComponentControls.controls[
          roomComponentControls.controls.length - 1
        ]
      );
      const travellerControls = <FormArray>travellerGroup.get("travellers");
      travellerControls.push(
        this.fb.group({
          firstName: [""],
          lastName: [""],
          roomToSelect: [""],
          bedToSelect: [""],
          showRoomInfo: true
        })
      );
      travellerControls.push(
        this.fb.group({
          firstName: ["24234"],
          lastName: [""],
          roomToSelect: [""],
          bedToSelect: [""],
          showRoomInfo: false
        })
      );
      this.createForm(
        this.maxCapacity,
        remainedTravellers,
        this.trip.selectedRoomQuantity.id,
        roomQuantity
      );
    }
  }
  assignRoom(remainedTravellers: number, roomQuantity: number) {
    if (remainedTravellers <= this.maxCapacity) {
      const room = this.createRoom(
        this.maxCapacity,
        remainedTravellers,
        this.trip.selectedRoomQuantity.id,
        roomQuantity
      );
      this.trip.rooms.push(room);
    } else {
      const room = this.createRoom(
        this.maxCapacity,
        this.maxCapacity,
        this.trip.selectedRoomQuantity.id,
        roomQuantity
      );
      this.trip.rooms.push(room);
      remainedTravellers -= this.maxCapacity;
      roomQuantity--;
      this.assignRoom(remainedTravellers, roomQuantity);
    }

    this.assignRoomIndex();
  }
  createForm(
    maxCapacity: number,
    remainedTravellers: number,
    selectedRoomQuantity: number,
    assignedRoomQuantity: number
  ) {
    // let roomsFitSelectedTravellersQuantity = JSON.parse(
    //   JSON.stringify(this.trip.availabledRooms)
    // ) as Room[];

    // const travellers = new Array<Traveller>();
    // const startIndex =
    //   maxCapacity * (selectedRoomQuantity - assignedRoomQuantity);
    // for (let k = 0; k < remainedTravellers; k++) {
    //   travellers.push(this.createNewTraveller(k + startIndex, 0));
    // }
    // const rooms = this.tourService.getRoomsByTheTravellersInTheRoom(
    //   travellers,
    //   this.trip.availabledRooms
    // );
    // const room = rooms[0];
    // travellers.map(c => (c.roomId = room.id));
    // room.travellers = Object.assign([], travellers);
    // return room;
    this.roomsForm = this.fb.group({
      roomComponents: this.fb.array([])
    });
    // this.allRooms.push(this.fb.control('234', Validators.required));
    // this.allRooms.push(this.fb.control('', Validators.required));
    const roomComponentControls = <FormArray>(
      this.roomsForm.controls.roomComponents
    );
    roomComponentControls.push(
      this.fb.group({
        roomIndex: ["2342"],
        travellers: this.fb.array([])
      })
    );
    const travellerGroup = <FormGroup>(
      roomComponentControls.controls[roomComponentControls.controls.length - 1]
    );
    const travellerControls = <FormArray>travellerGroup.get("travellers");
    travellerControls.push(
      this.fb.group({
        firstName: [""],
        lastName: [""],
        roomToSelect: [""],
        bedToSelect: [""],
        showRoomInfo: true
      })
    );
    travellerControls.push(
      this.fb.group({
        firstName: ["24234"],
        lastName: [""],
        roomToSelect: [""],
        bedToSelect: [""],
        showRoomInfo: false
      })
    );
  }
  createRoom(
    maxCapacity: number,
    remainedTravellers: number,
    selectedRoomQuantity: number,
    assignedRoomQuantity: number
  ): Room {
    const travellers = new Array<Traveller>();
    const startIndex =
      maxCapacity * (selectedRoomQuantity - assignedRoomQuantity);
    for (let k = 0; k < remainedTravellers; k++) {
      travellers.push(this.createNewTraveller(k + startIndex, 0));
    }
    const rooms = this.tourService.getRoomsByTheTravellersInTheRoom(
      travellers,
      this.trip.availabledRooms
    );
    const room = rooms[0];
    travellers.map(c => (c.roomId = room.id));
    room.travellers = Object.assign([], travellers);
    return room;
  }
  assignRoomIndex() {
    for (let i = 0; i < this.trip.rooms.length; i++) {
      this.trip.rooms[i].index = i + 1;
    }
  }
  createNewRoom(roomId: number): Room {
    const room = this.trip.availabledRooms.find(c => c.id === roomId);
    return { ...room };
  }
  createNewTraveller(id: number, roomId: number): Traveller {
    const traveller = new Traveller();
    traveller.id = id;
    traveller.title = "";
    traveller.firstName = "";
    traveller.middleName = "";
    traveller.lastName = "";
    traveller.placeofbirth = new CountryOrArea();
    traveller.birthday = null;
    traveller.passport = new Passport();
    traveller.passport.number = "";
    traveller.passport.issueDate = null;
    traveller.passport.expiryDate = null;
    traveller.passport.issuePlace = new CountryOrArea();
    traveller.countryOrArea = null;
    traveller.selectedOptions = null;
    traveller.needVisa = false;
    traveller.needInsuance = false;
    traveller.specialRequest = "";
    traveller.roomId = roomId;
    return traveller;
  }
  compareFn(c1: Quantity, c2: Quantity): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  travellerChange(newValue: Quantity) {
    this.trip.selectedTravellerQuantity = newValue;
    this.clearRooms();
    this.assignRoom(
      this.trip.selectedTravellerQuantity.id,
      this.trip.selectedRoomQuantity.id
    );
    this.trip.minRoomQuantityForTravellers = this.trip.rooms.length;
    this.trip.selectedRoomQuantity = this.trip.availabledRoomQuantities.find(
      c => c.id === this.trip.rooms.length
    );
    // for (let i = 0; i < this.trip.availabledRoomQuantities.length; i++) {
    //   if (
    //     this.trip.availabledRoomQuantities[i].id ===
    //     this.trip.minRoomQuantityForTravellers
    //   ) {
    //     this.trip.selectedRoomQuantity = this.trip.availabledRoomQuantities[i];
    //     break;
    //   }
    // }
    this.tourService.updateRoomInfo();
  }
  roomChange(newValue: Quantity) {
    if (newValue.id < this.trip.minRoomQuantityForTravellers) {
      this.log(
        `Room(s) quantity should not less than ${
          this.trip.minRoomQuantityForTravellers
        }`
      );
      return;
    } else if (newValue.id >= this.trip.selectedTravellerQuantity.id) {
      this.log(``);
      newValue = Object.assign({}, this.trip.selectedTravellerQuantity);
    } else if (newValue.id < this.trip.selectedTravellerQuantity.id) {
      this.log(``);
    }
    this.clearRooms();
    this.assignRoom(
      this.trip.selectedTravellerQuantity.id,
      this.trip.selectedRoomQuantity.id
    );
    this.trip.selectedRoomQuantity = Object.assign({}, newValue);

    const appendEmptyRoomsQuantity =
      this.trip.selectedRoomQuantity.id - this.trip.rooms.length;
    if (appendEmptyRoomsQuantity > 0) {
      for (let i = 0; i < appendEmptyRoomsQuantity; i++) {
        for (let j = 0; j < this.trip.availabledRooms.length; j++) {
          if (
            this.trip.availabledRooms[j].roomPriceForPerTraveller ===
            Math.min(
              ...this.trip.availabledRooms.map(c => c.roomPriceForPerTraveller)
            )
          ) {
            const newRoom = this.createNewRoom(this.trip.availabledRooms[j].id);
            newRoom.travellers = new Array<Traveller>();
            this.trip.rooms.push(newRoom); // Append the cheapest room
            break;
          }
        }
      }
      this.assignRoomIndex();
    }
  }
  private log(message: string) {
    if (message.length > 0) {
      this.messageService.clearMessage();
      this.messageService.add(`${message}`);
    }
  }
  get diagnostic() {
    return JSON.stringify(this.trip);
  }
  // verifyRooms(theForm: NgForm) {
  //   console.log(theForm.value);
  //   if (theForm.invalid) {
  //     // handle error.
  //     if (theForm.controls["name"].errors) {
  //       console.log(
  //         "name error:" + JSON.stringify(theForm.controls["name"].errors)
  //       );
  //     }
  //   }
  // }
  allDataCorrect(): string {
    if (this.trip.billingInfo.firstName.length === 0) {
      return `First Name is required`;
    }
    if (this.trip.billingInfo.lastName.length === 0) {
      return `Last Name is required`;
    }
    if (this.trip.billingInfo.email.length === 0) {
      return `E-Mail is required`;
    }
    if (this.trip.billingInfo.primaryPhone.length === 0) {
      return `Primary Phone is required`;
    }
    if (this.trip.billingInfo.mailingAddress.length === 0) {
      return `Mailing Address is required`;
    }
    if (this.trip.billingInfo.city.length === 0) {
      return `City is required`;
    }
    if (this.trip.billingInfo.country.id < 0) {
      return `Country is required`;
    }
    if (this.trip.billingInfo.provinceStates.length === 0) {
      return `Province or State is required`;
    }
    if (this.trip.billingInfo.postalCode.length === 0) {
      return `Postal Code is required`;
    }
    for (let i = 0; i < this.trip.rooms.length; i++) {
      if (this.trip.rooms[i].travellers.length > 0) {
        for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
          if (this.trip.rooms[i].travellers[j].firstName.length === 0) {
            return `Room #${this.trip.rooms[i].index}'s guest ${this.trip
              .rooms[i].travellers[j].id + 1}'s First Name is required`;
          }
          if (this.trip.rooms[i].travellers[j].lastName.length === 0) {
            return `Room #${this.trip.rooms[i].index}'s guest ${this.trip
              .rooms[i].travellers[j].id + 1}'s Last Name is required`;
          }
        }
      }
    }
    return "";
  }
  verify() {
    const verifyResult = this.allDataCorrect();
    if (verifyResult.length > 0) {
      this.tourService.openNgxModelDlg(verifyResult);
      return false;
    } else {
      this.isVerified = true;
    }
    if (this.isVerified) {
      this.goToOptions();
    }
  }
  goToOptions() {
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.updateSelectedTour(this.tour);
    this.tourService.updateSelectedTrip(this.trip);
    this.router.navigate(["/options"], {
      queryParams: { tourId: this.tourId, tripId: this.tripId }
    });
  }
  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(["/"]);
    }
  }
  onSubmit(form: FormGroup) {
    console.log(form.valid);
    console.log(form.value);
  }
}
