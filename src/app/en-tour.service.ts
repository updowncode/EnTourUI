import { Injectable, OnDestroy } from "@angular/core";
import { RequestOptions, Headers, Http } from "@angular/http";
import {
  of,
  Observable,
  BehaviorSubject,
  Subject,
  Subscription,
  throwError
} from "rxjs";
import { map, delay, switchMap, catchError, tap, retry } from "rxjs/operators";
import { MessageService } from "./message.service";
import { Tour } from "./Models/tour";
import { MockTours } from "./Models/mock-tours";
import { Trip } from "./Models/trip";
import { Quantity } from "./Models/quantity";
import { Room } from "./Models/room";
import { Option } from "./Models/option";
import { Traveller } from "./Models/traveller";
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Options } from "selenium-webdriver";
import { NgbdModalContent } from "./ngbd-model-content/ngbd-model-content";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
const FETCH_LATENCY = 500;
const httpOptions = {
  headers: new HttpHeaders({
    Authorization: "authkey",
    application: "entour"
  })
};
@Injectable()
export class EnTourService implements OnDestroy {
  private tours: Tour[] = [];
  private tour: Tour;
  private trip: Trip;
  // private toursUrl = "http://localhost:51796/api/entours"; // URL to web api
  // private bookUrl = "http://localhost:51796/api/bookentour"; // URL to web api
  private toursUrl =
    "http://dnndev.me/DesktopModules/EnTourModule/API/EnTourModuleAPI/entours"; // URL to web api
  private bookUrl =
    "http://dnndev.me/DesktopModules/EnTourModule/API/EnTourModuleAPI/bookentour"; // URL to web api

  //   private toursUrl =
  //   "http://192.168.168.117/DesktopModules/EnTourModule/API/EnTourModuleAPI/entours"; // URL to web api
  // private bookUrl =
  //   "http://192.168.168.117/DesktopModules/EnTourModule/API/EnTourModuleAPI/bookentour"; // URL to web api

  private headers = new Headers({ "Content-Type": "application/json" });
  private tourSelected = new BehaviorSubject<Tour>(null);
  private tripSelected = new BehaviorSubject<Trip>(null);
  private roomInfoUpdated = new BehaviorSubject<Boolean>(false);
  private roomsCanbeMovedTo = new BehaviorSubject<Boolean>(false);
  trip$ = this.tripSelected.asObservable();
  tour$ = this.tourSelected.asObservable();
  updateRoomInfo$ = this.roomInfoUpdated.asObservable();
  roomsCanbeMovedTo$ = this.roomsCanbeMovedTo.asObservable();
  toursSubscription: Subscription;
  tourSubscription: Subscription;
  tripSubscription: Subscription;

  constructor(
    private http: Http,
    private messageService: MessageService,
    private httpClient: HttpClient,
    private modalService: NgbModal
  ) {
    this.tourSubscription = this.tour$.subscribe(tour => {
      this.tour = tour;
    });
    this.tripSubscription = this.trip$.subscribe(trip => {
      this.trip = trip;
      if (trip) {
        this.toursSubscription = this.getToursAsync().subscribe(tours => {
          this.tours = tours;
          const tourIndex = this.tours.findIndex(
            tour => tour.trips.find(d => d.id === trip.id).id === trip.id
          );
          const tripIndex = this.tours[tourIndex].trips.findIndex(
            d => d.id === trip.id
          );
          this.tours[tourIndex].trips[tripIndex] = this.trip;
        });
      }
    });
  }
  ngOnDestroy() {
    this.toursSubscription.unsubscribe();
    this.tourSubscription.unsubscribe();
    this.tripSubscription.unsubscribe();
  }
  public saveTours(value: Tour[]) {
    this.tours = Object.assign([], value);

    // this.tours = [];
    // this.tours.push(...value);
  }

  getToursAsync(): Observable<Tour[]> {
    if (this.tours.length === 0) {
      // return this.httpClient
      //   .get<Tour[]>(this.toursUrl, {
      //     headers: { a: "a" }
      //   })
      return this.httpClient.get<Tour[]>(this.toursUrl).pipe(
        // retry(3),
        // tap(tours => this.log("fetched tours")),
        catchError(this.handleObservableError("getToursAsync", []))
      );
    } else {
      return of(this.tours);
    }
  }
  getToursAsync1(): Observable<HttpResponse<Tour[]>> {
    return this.httpClient
      .get<Tour[]>(this.toursUrl, {
        headers: { a: "a" },
        observe: "response"
      })
      .pipe(
        retry(3),
        tap(resp => this.log(`response header[a]${resp.headers.get("a")}`)),
        catchError(this.handleError1)
      );
  }
  private handleError1(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }
  getTourById(tourId: string): Observable<Tour> {
    if (this.tours.length === 0) {
      // return of(MockTours.find(c => c.id === tourId));
      return this.httpClient.get<Tour[]>(this.toursUrl).pipe(
        //    tap(tours => this.log("fetched tour")),
        catchError(this.handleObservableError("getTourById", {})),
        switchMap((tours: Tour[]) => of(tours.find(tour => tour.id === tourId)))
      );
    } else {
      return of(this.tours.find(tour => tour.id === tourId));
    }
  }
  setupTravellers(rooms: Room[]): Traveller[] {
    const travellers = [];
    rooms.forEach((c: Room) => {
      if (c.travellers != null) {
        c.travellers.forEach(d => {
          travellers.push(d);
        });
      }
    });
    return travellers;
  }
  updateRoomInfo() {
    this.roomInfoUpdated.next(true);
  }
  updateRoomsCanbeMovedTo() {
    this.roomsCanbeMovedTo.next(true);
  }
  getRoomsByTheTravellersInTheRoom(
    travellers: Traveller[],
    availabledRooms: Room[]
  ): Room[] {
    let roomsFitSelectedTravellersQuantity = JSON.parse(
      JSON.stringify(availabledRooms)
    ) as Room[];
    if (travellers.length === 1) {
      for (let j = 0; j < roomsFitSelectedTravellersQuantity.length; j++) {
        if (roomsFitSelectedTravellersQuantity[j].capacity >= 2) {
          roomsFitSelectedTravellersQuantity[j].roomPriceForPerTraveller +=
            roomsFitSelectedTravellersQuantity[j].singleSupplement;
        }
      }
      const rooms = roomsFitSelectedTravellersQuantity.sort((a, b) => {
        if (a.roomPriceForPerTraveller > b.roomPriceForPerTraveller) {
          return 1;
        }
        if (a.roomPriceForPerTraveller < b.roomPriceForPerTraveller) {
          return -1;
        }
        return 0;
      });
      // // for (let j = rooms.length - 1; j > 0; j--) {
      // //   if (rooms[j].capacity > 2) {
      // //     rooms.splice(j, 1);
      // //   }
      // // }
      rooms.map(c => (c.travellers = Object.assign([], travellers)));
      return rooms;
    } else {
      roomsFitSelectedTravellersQuantity = roomsFitSelectedTravellersQuantity.filter(
        r => r.capacity >= travellers.length
      );
      roomsFitSelectedTravellersQuantity.map(
        c => (c.travellers = Object.assign([], travellers))
      );
      return roomsFitSelectedTravellersQuantity;
    }
  }
  updateSelectedTrip(trip: Trip) {
    this.tripSelected.next(trip);
  }
  updateSelectedTour(tour: Tour) {
    this.tourSelected.next(tour);
  }
  openModelDlg(message: string) {
    const modalRef = this.modalService.open(NgbdModalContent, {
      backdrop: "static",
      keyboard: false
    });
    modalRef.componentInstance.message = message;
  }
  payment(trip: Trip): Promise<any> {
    return this.http
      .post(this.bookUrl, JSON.stringify(trip), {
        headers: this.headers
      })
      .toPromise()
      .catch(error => {
        console.error("An error occurred", error); // for demo purposes only
        this.log(error.statusText + ": " + error._body);
        this.openModelDlg(error.statusText + ": " + error._body);
      });
  }
  private log(message: string) {
    if (message.length > 0) {
      this.messageService.clearMessage();
      this.messageService.add(`${message}`);
    }
  }
  private handleObservableError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  private handleError3(
    error: any,
    messageService: MessageService
  ): Promise<any> {
    console.error("An error occurred", error); // for demo purposes only
    messageService.clearMessage();
    messageService.sendMessage("An error occurred" + error);
    messageService.add("setup ok").subscribe((result: boolean) => {
      if (!result) {
        console.log("");
        return;
      }
      console.log("error add");
    });
    return Promise.reject(error.message || error);
  }
  //#region Promise usages
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
  getTours(): Promise<Tour[]> {
    // const header = new Headers({ "Content-Type": "application/json", a: "a" });
    // const requestOptions = new RequestOptions({
    //   headers: header,
    //   withCredentials: false
    // });
    return this.http
      .get(this.toursUrl) // , requestOptions
      .toPromise()
      .then(response => response.json() as Tour[])
      .then(resp => (this.tours = Object.assign([], resp)))
      .catch(this.handleError);
  }
  getTour(id: string): Promise<Tour> {
    const url = `${this.toursUrl}/${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as Tour)
      .catch(this.handleError);
  }
  updateTour(tour: Tour): Promise<Tour> {
    const url = `${this.toursUrl}/${tour.id}`;
    return (
      this.http
        .put(url, JSON.stringify(tour), { headers: this.headers })
        .toPromise()
        // .then(
        //   res => {
        //     console.log(res.json());
        //     resolve();
        //   },
        //   msg => {
        //     throw new Error("Couldn't get all Bookings: " + msg);
        //   }
        // )
        .then(() => tour)
        .catch(this.handleError)
    );
  }
  createTour(name: string): Promise<Tour> {
    return this.http
      .post(this.toursUrl, JSON.stringify({ name: name }), {
        headers: this.headers
      })
      .toPromise()
      .then(res => res.json() as Tour)
      .catch(this.handleError);
  }
  deleteTour(id: number): Promise<void> {
    const url = `${this.toursUrl}/${id}`;
    return this.http
      .delete(url, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }
  //#endregion
}
