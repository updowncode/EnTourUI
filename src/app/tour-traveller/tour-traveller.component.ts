import { Component, OnInit, HostBinding } from "@angular/core";
import { EnTourCoreService } from "../en-tour-core/en-tour-core.service";
import { EnTourService } from "../en-tour.service";
import { slideInDownAnimation } from "../animations";
import { Router, ActivatedRoute } from "@angular/router";
import { Tour } from "../Models/tour";
import { Trip } from "../Models/trip";
import { Traveller } from "../Models/traveller";
import { Quantity } from "../Models/quantity";
import { BillingInfo } from "../Models/billing-info";
import { Option } from "../Models/option";
import { Room } from "../Models/room";
import { Passport } from "../Models/passport";

@Component({
  selector: "app-tour-traveller",
  templateUrl: "./tour-traveller.component.html",
  styleUrls: ["./tour-traveller.component.sass"],
  animations: [slideInDownAnimation]
})
export class TourTravellerComponent implements OnInit {
  @HostBinding("@routeAnimation") routeAnimation = true;
  @HostBinding("style.display") display = "block";
  @HostBinding("style.position") position = "related";
  trip: Trip;
  tour: Tour;
  tourId: number;
  tripId: number;
  msg = "Loading Traveller ...";
  capacities: number[];
  availabledRooms: Room[];
  minDefaultRoomQuantity: number;
  constructor(
    private tourService: EnTourService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.msg = "";
    this.tourId = +this.activatedRoute.snapshot.queryParamMap.get("tourId");
    this.tripId = +this.activatedRoute.snapshot.queryParamMap.get("tripId");
    this.trip = this.tourService.retrieveTrip();
    if (this.trip === undefined) {
      if (localStorage.getItem(this.tripId.toString()) != null) {
        this.trip = JSON.parse(localStorage.getItem(this.tripId.toString()));
      } else {
        this.router.navigate(["/tours"]);
      }
    }

    this.initTrip();
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.saveTrip(this.trip);
  }

  initTrip() {
    this.trip.billingInfo = new BillingInfo();
    this.trip.availabledTravellerQuantities = this.tourService.getAvailabledTravellerQuantities(
      this.tourId,
      this.tripId
    );
    this.trip.availabledRoomQuantities = this.tourService.getAvailabledRoomQuantities(
      this.tourId,
      this.tripId,
      this.trip.availabledTravellerQuantities[0]
    );

    this.availabledRooms = this.tourService.getRooms(this.tourId, this.tripId);
    this.capacities = this.tourService.getRoomCapacities(this.availabledRooms);
    this.trip.selectedTravellerQuantity = this.trip.availabledTravellerQuantities[
      this.trip.tripCostForDefaultTravellerQuantity - 1
    ];
    this.trip.selectedRoomQuantity = this.defaultRoomQuantity(
      this.trip.selectedTravellerQuantity,
      this.trip.availabledRoomQuantities,
      this.availabledRooms
    );
    this.clearRooms();
    this.assignRoom(
      this.trip.selectedTravellerQuantity.id,
      this.trip.selectedRoomQuantity.id
    );
    this.minDefaultRoomQuantity = this.trip.rooms.length;
    const ops = this.tourService.getOptions(this.tourId, this.tripId);
    this.trip.rooms[0].travellers[0].selectedOptions = new Array<Option>();
    this.trip.rooms[0].travellers[0].selectedOptions.push(ops[0]);
  }
  onRoomCanbeMovedTo(needUpdate: boolean) {
    if (needUpdate) {
      this.tourService.updateRoomsCanbeMovedTo();
    }
  }
  assignRoom(remainedTravellers: number, roomQuantity: number) {
    const maxCapacity = Math.max(...this.capacities);
    if (remainedTravellers <= maxCapacity) {
      for (let j = 0; j < this.availabledRooms.length; j++) {
        if (this.availabledRooms[j].capacity >= remainedTravellers) {
          const room = this.createNewRoom(this.availabledRooms[j].id);
          room.travellers = new Array<Traveller>();
          const startIndex =
            maxCapacity * (this.trip.selectedRoomQuantity.id - roomQuantity);
          for (let k = 0; k < remainedTravellers; k++) {
            room.travellers.push(
              this.createNewTraveller(k + startIndex, room.id)
            );
          }
          this.trip.rooms.push(room);
          break;
        }
      }
    } else {
      for (let j = 0; j < this.availabledRooms.length; j++) {
        if (this.availabledRooms[j].capacity === maxCapacity) {
          const room = this.createNewRoom(this.availabledRooms[j].id);
          room.travellers = new Array<Traveller>();
          const startIndex =
            maxCapacity * (this.trip.selectedRoomQuantity.id - roomQuantity);
          for (let k = 0; k < maxCapacity; k++) {
            room.travellers.push(
              this.createNewTraveller(k + startIndex, room.id)
            );
          }
          this.trip.rooms.push(room);
          break;
        }
      }

      remainedTravellers = remainedTravellers - maxCapacity;
      roomQuantity--;
      this.assignRoom(remainedTravellers, roomQuantity);
    }

    this.assignRoomIndex();
  }
  assignRoomIndex() {
    this.trip.rooms.forEach(c => (c.index = this.trip.rooms.indexOf(c) + 1));
  }
  createNewRoom(roomId: number): Room {
    const availabledRoom = this.availabledRooms.find(c => c.id === roomId);
    return { ...availabledRoom };
  }
  createNewTraveller(id: number, roomId: number): Traveller {
    const traveller = new Traveller();
    traveller.id = id;
    traveller.title = "";
    traveller.firstName = "";
    traveller.middleName = "";
    traveller.lastName = "";
    traveller.placeofbirth = "";
    traveller.birthday = "";
    traveller.passport = new Passport();
    traveller.passport.number = "";
    traveller.passport.issueDate = "";
    traveller.passport.expiryDate = "";
    traveller.passport.issuePlace = { id: 1, name: "Canada", code: "CA" };
    traveller.countryorarea = null;
    traveller.selectedOptions = null;
    traveller.needVisa = true;
    traveller.needInsuance = true;
    traveller.specialRequest = "";
    traveller.roomId = roomId;
    return traveller;
  }
  compareFn(c1: Quantity, c2: Quantity): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  goToOptions(): void {
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.saveTrip(this.trip);

    this.router.navigate(["/options"], {
      queryParams: { tourId: this.tourId, tripId: this.tripId }
    });
  }
  defaultRoomQuantity(
    selectedTravellerQuantity: Quantity,
    availabledRoomQuantities: Quantity[],
    availabledRooms: Room[]
  ): Quantity {
    let pointer = 0;
    const maxCapacity = Math.max(...this.capacities);
    if (selectedTravellerQuantity.id > maxCapacity) {
      let remained = selectedTravellerQuantity.id;
      do {
        pointer++;
        remained -= maxCapacity;
      } while (remained > maxCapacity);
    }
    return availabledRoomQuantities[pointer];
  }
  clearRooms() {
    this.trip.rooms = new Array<Room>();
  }
  travellerChange(newValue: Quantity) {
    this.trip.selectedTravellerQuantity = newValue;
    this.clearRooms();
    this.assignRoom(
      this.trip.selectedTravellerQuantity.id,
      this.trip.selectedRoomQuantity.id
    );
    this.minDefaultRoomQuantity = this.trip.rooms.length;
    for (let i = 0; i < this.trip.availabledRoomQuantities.length; i++) {
      if (
        this.trip.availabledRoomQuantities[i].id === this.minDefaultRoomQuantity
      ) {
        this.trip.selectedRoomQuantity = this.trip.availabledRoomQuantities[i];
        break;
      }
    }
  }
  roomChange(newValue: Quantity) {
    if (newValue.id < this.minDefaultRoomQuantity) {
      this.msg =
        "Room(s) quantity should not less than " + this.minDefaultRoomQuantity;
      return;
    } else if (newValue.id >= this.trip.selectedTravellerQuantity.id) {
      this.msg = "";
      newValue.id = this.trip.selectedTravellerQuantity.id;
    } else if (newValue.id < this.trip.selectedTravellerQuantity.id) {
      this.msg = "";
    }
    this.clearRooms();
    this.assignRoom(
      this.trip.selectedTravellerQuantity.id,
      this.trip.selectedRoomQuantity.id
    );
    this.trip.selectedRoomQuantity = newValue;

    const appendEmptyRoomsQuantity =
      this.trip.selectedRoomQuantity.id - this.trip.rooms.length;
    if (appendEmptyRoomsQuantity > 0) {
      for (let i = 0; i < appendEmptyRoomsQuantity; i++) {
        for (let j = 0; j < this.availabledRooms.length; j++) {
          if (
            this.availabledRooms[j].roomPrice ===
            Math.min(...this.availabledRooms.map(c => c.roomPrice))
          ) {
            const newRoom = this.createNewRoom(this.availabledRooms[j].id);
            newRoom.travellers = new Array<Traveller>();
            this.trip.rooms.push(newRoom); // Append the cheapest room
            break;
          }
        }
      }
      this.assignRoomIndex();
    }
  }
}
