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
  msg = "Loading Traveller ...";
  selectedTravellerQuantity: Quantity;
  availabledTravellerQuantities: Quantity[];
  selectedRoomQuantity: Quantity;
  availabledRoomQuantities: Quantity[];
  maxCapacity: number;
  constructor(
    private tourService: EnTourService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.tourId = params.tourId;
      this.tripId = params.tripId;
      this.tourService.getToursAsync().subscribe((tours: Tour[]) => {
        this.tour = Object.assign(
          {},
          tours.find(tour => tour.id === this.tourId)
        );
        this.trip = this.tour.trips.find(trip => trip.id === this.tripId);
        this.tourService.shareTour(this.tour);
        this.tourService.shareTrip(this.trip);
        this.maxCapacity = Math.max(
          ...this.trip.availabledRooms.map(room => room.capacity)
        );
        if (this.trip.rooms.length === 0) {
          this.initRooms();
          this.tourService.updateRoomInfo();
          this.msg = "";
        }
      });
    });
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
    for (let i = this.trip.rooms.length - 1; i >= 0; i--) {
      if (this.trip.rooms[i].index === room.index) {
        this.trip.rooms.splice(i, 1);
      }
    }
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
  travellerChange(newValue: Quantity) {
    this.trip.selectedTravellerQuantity = newValue;
    this.clearRooms();
    this.assignRoom(
      this.trip.selectedTravellerQuantity.id,
      this.trip.selectedRoomQuantity.id
    );
    this.trip.minRoomQuantityForTravellers = this.trip.rooms.length;
    for (let i = 0; i < this.trip.availabledRoomQuantities.length; i++) {
      if (
        this.trip.availabledRoomQuantities[i].id ===
        this.trip.minRoomQuantityForTravellers
      ) {
        this.trip.selectedRoomQuantity = this.trip.availabledRoomQuantities[i];
        break;
      }
    }
    this.tourService.updateRoomInfo();
  }
  roomChange(newValue: Quantity) {
    if (newValue.id < this.trip.minRoomQuantityForTravellers) {
      this.msg =
        "Room(s) quantity should not less than " +
        this.trip.minRoomQuantityForTravellers;
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
  assignTravellersId() {
    let totalTravellers = 0;
    for (let i = 0; i < this.trip.rooms.length; i++) {
      for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
        totalTravellers++;
      }
    }
    for (let i = 0; i < this.trip.rooms.length; i++) {
      for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
        this.trip.rooms[i].travellers[j].id = totalTravellers--;
      }
    }
  }
  goToOptions(): void {
    // this.assignTravellersId();
    localStorage.removeItem(this.tripId.toString());
    localStorage.setItem(this.tripId.toString(), JSON.stringify(this.trip));
    this.tourService.shareTour(this.tour);
    this.tourService.shareTrip(this.trip);
    this.router.navigate(["/options"], {
      queryParams: { tourId: this.tourId, tripId: this.tripId }
    });
  }
}
