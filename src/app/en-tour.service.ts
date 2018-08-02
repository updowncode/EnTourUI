import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";
import { of, Observable, BehaviorSubject, Subject } from "rxjs";
import { map, delay } from "rxjs/operators";
import { MessageService } from "./message.service";
import { Tour } from "./Models/tour";
import { MockTours } from "./Models/mock-tours";
import { Trip } from "./Models/trip";
import { Quantity } from "./Models/quantity";
import { Room } from "./Models/room";
import { MockIncludeIns } from "./Models/mock-include-in";
import { MockNotIncludeIns } from "./Models/mock-not-include-in";
import { MockTripInclude } from "./Models/mock-trip-include";
import { MockRooms } from "./Models/mock-rooms";
import { MockOptions } from "./Models/mock-options";
import { Option } from "./Models/option";
import { MockTourInfoSource } from "./Models/mock-tour-info-source";
import { Traveller } from "./Models/traveller";
const FETCH_LATENCY = 500;

@Injectable()
export class EnTourService {
  tour: Tour;
  trip: Trip;
  visible: boolean;
  travellerQuantities = Array<Quantity>();
  roomQuantities = Array<Quantity>();
  private tourSelected = new BehaviorSubject<Tour>(null);
  private tripShared = new BehaviorSubject(this.trip);
  trip$ = this.tripShared.asObservable();
  tour$ = this.tourSelected.asObservable();
  private roomInfoUpdated = new BehaviorSubject<Boolean>(false);
  updateRoomInfo$ = this.roomInfoUpdated.asObservable();
  private roomsCanbeMovedTo = new BehaviorSubject<Boolean>(false);
  roomsCanbeMovedTo$ = this.roomsCanbeMovedTo.asObservable();
  private toursUrl = "https://b2b.toureast.com/api/heroes"; // URL to web api
  private createtour = "https://b2b.toureast.com/api/createhero";
  private headers = new Headers({ "Content-Type": "application/json" });

  private selectedTrip: Trip;
  public saveTrip(value: Trip) {
    this.selectedTrip = value;
  }
  public retrieveTrip() {
    return this.selectedTrip;
  }
  public updateRoomInfo() {
    this.roomInfoUpdated.next(true);
  }
  public updateRoomsCanbeMovedTo() {
    this.roomsCanbeMovedTo.next(true);
  }
  public getRoomCapacities(availabledRooms: Room[]): number[] {
    const capacities = new Array<number>();
    for (let i = 0; i < availabledRooms.length; i++) {
      if (capacities.indexOf(availabledRooms[i].capacity) < 0) {
        capacities.push(availabledRooms[i].capacity);
      }
    }
    return capacities.sort((a, b) => {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    });
  }
  ShareTrip(trip: Trip) {
    this.trip$.next(trip);
  }
  shareTour(tour: Tour) {
    this.tourSelected.next(tour);
  }
  getRoomsByTheTravellersInTheRoom(travellers: Traveller[], availabledRooms: Room[]): Room[] {
    const roomsFitSelectedTravellersQuantity = JSON.parse(JSON.stringify(availabledRooms)); // Object.assign([], availabledRooms);
    if (travellers.length === 1) {
      for (let j = 0; j < roomsFitSelectedTravellersQuantity.length; j++) {
        if (roomsFitSelectedTravellersQuantity[j].capacity >= 2) {
          roomsFitSelectedTravellersQuantity[
            j
          ].roomPrice += roomsFitSelectedTravellersQuantity[
            j
          ].singleSupplement;
        }
      }
      const rooms = roomsFitSelectedTravellersQuantity.sort((a, b) => {
        if (a.roomPrice > b.roomPrice) {
          return 1;
        }
        if (a.roomPrice < b.roomPrice) {
          return -1;
        }
        return 0;
      });
      // for (let j = rooms.length - 1; j > 0; j--) {
      //   if (rooms[j].capacity > 2) {
      //     rooms.splice(j, 1);
      //   }
      // }
      return rooms;
    } else {
      for (
        let j = roomsFitSelectedTravellersQuantity.length - 1;
        j >= 0;
        j--
      ) {
        if (
          roomsFitSelectedTravellersQuantity[j].capacity <
          travellers.length
        ) {
          roomsFitSelectedTravellersQuantity.splice(j, 1);
        }
      }
      return roomsFitSelectedTravellersQuantity;
    }
  }
  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error); // for demo purposes only
    this.messageService.clearMessage();
    this.messageService.sendMessage("An error occurred" + error);
    this.messageService.add("setup ok").subscribe((result: boolean) => {
      if (!result) {
        console.log("");
        return;
      }
      console.log("error add");
    });
    return Promise.reject(error.message || error);
  }
  constructor(private http: Http, private messageService: MessageService) {
    this.visible = false;
  }
  getToursMockData(): Tour[] {
    return MockTours;
  }
  getToursMockDataById(id: number): Tour {
    return MockTours.find(c => c.id === id);
  }
  getRooms(tourId: number, tripId: number): Room[] {
    return MockRooms.filter(
      c => c.tourId === tourId && c.tripId === tripId
    ).sort((a, b) => {
      if (a.roomPrice > b.roomPrice) {
        return 1;
      }
      if (a.roomPrice < b.roomPrice) {
        return -1;
      }
      return 0;
    });
  }
  getOptions(tourId: number, tripId: number): Option[] {
    return MockOptions.filter(c => c.tourId === tourId && c.tripId === tripId);
  }
  getTourInfoSource(): string[] {
    return MockTourInfoSource;
  }
  getIncludeIn(tourId: number, tripId: number): MockTripInclude[] {
    return MockIncludeIns.filter(
      c => c.tourId === tourId && c.tripId === tripId
    );
  }

  getNotIncludeIn(tourId: number, tripId: number): MockTripInclude[] {
    return MockNotIncludeIns.filter(
      c => c.tourId === tourId && c.tripId === tripId
    );
  }
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
  }
  setTrip(trip: Trip) {
    this.trip = trip;
  }
  getTourMockData(id: number): Tour {
    if (this.tour == null) {
      return MockTours.find(c => c.id === id);
    }
    return this.tour;
  }
  getAvailabledTravellerQuantities(tourId: number, tripId: number): Quantity[] {
    this.travellerQuantities = Array<Quantity>();
    for (let quantity = 1; quantity <= 30; quantity++) {
      this.travellerQuantities.push(new Quantity(quantity, "Adult"));
    }
    // return of(this.travellerQuantities).pipe(delay(FETCH_LATENCY));
    return this.travellerQuantities;
  }
  getAvailabledRoomQuantities(
    tourId: number,
    tripId: number,
    travellerQuantity: Quantity
  ): Quantity[] {
    this.roomQuantities = Array<Quantity>();
    for (let quantity = 1; quantity <= 30; quantity++) {
      this.roomQuantities.push(new Quantity(quantity, "Room"));
    }
    return this.roomQuantities;
  }
  getTrip(tourId: number, tripId: number): Observable<Trip> {
    if (this.trip == null) {
      this.trip = this.getTourMockData(tourId).trips.find(c => c.id === tripId);
    }
    return of(this.trip);
  }

  quotePrice(
    tourId: number,
    tripId: number,
    travellerQuantity: number,
    roomQuantity: number
  ): Tour {
    const tour = this.getTourMockData(tourId);
    tour.trips = new Array<Trip>();
    tour.trips.push(tour.trips.find(c => c.id === tripId));
    return new Tour();
  }
  getTours(): Promise<Tour[]> {
    return this.http
      .get(this.toursUrl)
      .toPromise()
      .then(response => response.json() as Tour[])
      .catch(this.handleError);
  }
  getTour(id: number): Promise<Tour> {
    const url = `${this.toursUrl}/${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as Tour)
      .catch(this.handleError);
  }

  getMockTours() {
    return of(MockTours);
  }

  getMockTour(id: number | string) {
    return this.getMockTours().pipe(
      // (+) before `id` turns the string into a number
      map(tours => tours.find(tour => tour.id === +id))
    );
  }
  update(tour: Tour): Promise<Tour> {
    const url = `${this.toursUrl}/${tour.id}`;
    return this.http
      .put(url, JSON.stringify(tour), { headers: this.headers })
      .toPromise()
      .then(() => tour)
      .catch(this.handleError);
  }
  create(name: string): Promise<Tour> {
    return this.http
      .post(this.createtour, JSON.stringify({ name: name }), {
        headers: this.headers
      })
      .toPromise()
      .then(res => res.json() as Tour)
      .catch(this.handleError);
  }
  delete(id: number): Promise<void> {
    const url = `${this.toursUrl}/${id}`;
    return this.http
      .delete(url, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }
}
