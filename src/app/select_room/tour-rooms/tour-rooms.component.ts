import {
  Component,
  OnInit,
  HostBinding,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef
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
import { Form, NgForm, FormGroup } from "@angular/forms";
@Component({
  selector: "app-tour-rooms",
  templateUrl: "./tour-rooms.component.html",
  styleUrls: ["./tour-rooms.component.sass"],
  animations: [slideInDownAnimation]
})
export class TourRoomsComponent implements OnInit, OnDestroy {
  @HostBinding("@routeAnimation")
  routeAnimation = true;
  @HostBinding("style.display")
  display = "block";
  @HostBinding("style.position")
  position = "related";
  trip: Trip;
  tour: Tour;
  tourId: string;
  tripId: string;
  paramSubscription: Subscription;
  toursSubscription: Subscription;
  maxCapacity: number;
  isVerified: boolean;
  constructor(
    private tourService: EnTourService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private messageService: MessageService
  ) {
    // this.location.replaceState("/");
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
      this.initRooms();
      this.tourService.updateRoomInfo();
    } else {
      this.trip.selectedRoomQuantity = this.trip.availabledRoomQuantities[
        this.trip.rooms.length - 1
      ];
      const travellers = this.trip.rooms.reduce(
        (p, u) => [...p, ...u.travellers],
        []
      );
      this.trip.selectedTravellerQuantity = this.trip.availabledTravellerQuantities[
        travellers.length - 1
      ];
    }
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
    window.scrollTo(0, 0);
  }

  initRooms() {
    // this.trip.selectedTravellerQuantity = this.trip.availabledTravellerQuantities[
    //   this.trip.tripCostForDefaultTravellerQuantity - 1
    // ];
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
    traveller.isChild = false;
    traveller.placeofbirth = "";
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
    this.messageService.clearMessage();
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
    this.messageService.clearMessage();
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
    for (let i = this.trip.rooms.length - 1; i >= 0; i--) {
      if (this.trip.rooms[i].travellers.length === 0) {
        let k = i - 1;
        let bMoveSuccess = false;
        while (!bMoveSuccess) {
          if (this.trip.rooms[k].travellers.length > 1) {
            this.tourService.MoveTravellerToRoom(
              this.trip.rooms[k].travellers[
                this.trip.rooms[k].travellers.length - 1
              ],
              this.trip.rooms[i].index
            );
            this.onRoomCanbeMovedTo(true);
            bMoveSuccess = true;
          } else {
            k--;
          }
        }
      }
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
    let errQuantity = 0;
    for (let i = 0; i < this.trip.rooms.length; i++) {
      if (this.trip.rooms[i].travellers.length > 0) {
        for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
          // firstName
          if (
            this.trip.rooms[i].travellers[j].firstName === null ||
            this.trip.rooms[i].travellers[j].firstName.trim() === ""
          ) {
            $("input[name='psgFirstName'").each(function(index, el) {
              if ($(el).val() === "") {
                errQuantity++;
                $(el).addClass("ng-invalid ng-touched");
              }
            });
            // return `Passenger ${this.trip.rooms[i].travellers[j].id +
            //   1}'s first name is required`;
          }
          // lastName
          if (
            this.trip.rooms[i].travellers[j].lastName === null ||
            this.trip.rooms[i].travellers[j].lastName.trim() === ""
          ) {
            $("input[name='psgLastName'").each(function(index, el) {
              if ($(el).val() === "") {
                errQuantity++;
                $(el).addClass("ng-invalid ng-touched");
              }
            });
            // return `Passenger ${this.trip.rooms[i].travellers[j].id +
            //   1}'s last name is required`;
          }
        }
      }
    }
    if (errQuantity > 0) {
      return "Please fill all the required fields";
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
}

// @Component({
//   // tslint:disable-next-line:component-selector
//   selector: 'ngbd-modal-content',
//   template: `
//     <div class="modal-header">
//       <h4 class="modal-title">Information</h4>
//       <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
//         <span aria-hidden="true">&times;</span>
//       </button>
//     </div>
//     <div class="modal-body">
//       <p [innerHTML]="message"></p>
//     </div>
//     <div class="modal-footer">
//       <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
//     </div>
//   `
// })
// // tslint:disable-next-line:component-class-suffix
// export class NgbdModalContent {
//   @Input() message;

//   constructor(public activeModal: NgbActiveModal) {}
// }
