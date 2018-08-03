import { Component, OnInit, HostBinding, OnDestroy } from "@angular/core";
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
import { Subscription } from "rxjs";

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
    if (this.trip.rooms.length === 0) {
      this.initTrip();
      localStorage.removeItem(this.tripId.toString());
      localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
      this.tourService.saveTrip(this.trip);
      this.tourService.updateRoomInfo();
    }
  }

  initTrip() {
    this.trip.billingInfo = new BillingInfo();
    this.trip.tourInfoSource = "";
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
    this.tourService.updateRoomInfo();
  }
  onRoomCanbeMovedTo(needUpdate: boolean) {
    if (needUpdate) {
      for (let i = 0; i < this.trip.rooms.length; i++) {
        const rooms = Object.assign(
          [],
          this.tourService.getRoomsByTheTravellersInTheRoom(
            this.trip.rooms[i].travellers,
            this.availabledRooms
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
    for (let i = this.trip.rooms.length - 1; i >= 0; i--) {
      if (this.trip.rooms[i].index === room.index) {
        this.trip.rooms.splice(i, 1);
      }
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
      this.availabledRooms
    );
    const room = rooms[0];
    travellers.map(c => (c.roomId = room.id));
    room.travellers = Object.assign([], travellers);
    return room;
  }
  assignRoom(remainedTravellers: number, roomQuantity: number) {
    const maxCapacity = Math.max(...this.capacities);

    if (remainedTravellers <= maxCapacity) {
      const room = this.createRoom(
        maxCapacity,
        remainedTravellers,
        this.trip.selectedRoomQuantity.id,
        roomQuantity
      );
      this.trip.rooms.push(room);
    } else {
      const room = this.createRoom(
        maxCapacity,
        maxCapacity,
        this.trip.selectedRoomQuantity.id,
        roomQuantity
      );
      this.trip.rooms.push(room);
      remainedTravellers -= maxCapacity;
      roomQuantity--;
      this.assignRoom(remainedTravellers, roomQuantity);
    }

    this.assignRoomIndex();
  }
  assignRoomIndex() {
    for (let i = 0; i < this.trip.rooms.length; i++) {
      this.trip.rooms[i].index = i + 1;
    }
  }
  createNewRoom(roomId: number): Room {
    const room = this.availabledRooms.find(c => c.id === roomId);
    return { ...room };
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
    traveller.needVisa = false;
    traveller.needInsuance = false;
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
    this.tourService.updateRoomInfo();
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
