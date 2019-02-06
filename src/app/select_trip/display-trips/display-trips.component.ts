import {
  Component,
  OnInit,
  Input,
  HostBinding,
  OnDestroy,
  Inject,
  ViewChild,
  ElementRef,
  OnChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked
} from "@angular/core";
import {
  ActivatedRoute,
  ParamMap,
  Router,
  NavigationError,
  RouterEvent,
  NavigationEnd
} from "@angular/router";
import { EnTourService } from "../../en-tour.service";
import { Tour } from "../../Models/tour";
import { slideInDownAnimation } from "../../app.animations";
import { Trip } from "../../Models/trip";
import { Subscription } from "rxjs";
import { MessageService } from "../../message.service";
import { APP_BASE_HREF } from "@angular/common";
import { filter, switchMap } from "rxjs/operators";
import * as $ from "jquery";
@Component({
  selector: "app-display-trips",
  templateUrl: "./display-trips.component.html",
  styleUrls: ["./display-trips.component.sass"],
  animations: [slideInDownAnimation]
})
export class DisplayTripsComponent
  implements
    OnChanges,
    OnInit,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy {
  // @ViewChild("myNav", {read: ElementRef}) el: ElementRef;
  tour: Tour;
  trip: Trip;
  tourId: string;
  tripId: string;
  toursSubscription: Subscription;
  showSingleSupplement: boolean;
  @HostBinding("@routeAnimation")
  routeAnimation = true;
  @HostBinding("style.display")
  display = "block";
  @HostBinding("style.position")
  position = "related";
  constructor(
    private activatedRoute: ActivatedRoute,
    private tourService: EnTourService,
    private router: Router,
    @Inject(APP_BASE_HREF) public baseHref: string,
    private messageService: MessageService
  ) {
    // router.events.filter(e => e instanceof NavigationError).subscribe(e => {
    //   this.messageService.add(e.error);
    // });
    // this.navigationSubscription = this.router.events.subscribe((e: any) => {
    //   // If it is a NavigationEnd event re-initalise the component
    //   if (e instanceof NavigationEnd) {
    //     this.initialiseInvites();
    //   }
    // });
  }
  onResult(tours: Tour[]) {
    this.tourService.saveTours(tours);
    this.tour = Object.assign({}, tours.find(tour => tour.id === this.tourId));
    this.initTrips();
  }
  ngOnChanges(): void {
    // 当 Angular（重新）设置数据绑定输入属性时响应。 该方法接受当前和上一属性值的 SimpleChanges 对象当被绑定的输入属性的值发生变化时调用，首次调用一定会发生在 ngOnInit() 之前。
  }
  ngOnInit(): void {
    // 在 Angular 第一次显示数据绑定和设置指令/组件的输入属性之后，初始化指令/组件。在第一轮 ngOnChanges() 完成之后调用，只调用一次。
    // this.tourId = this.activatedRoute.snapshot.paramMap.get("id");
    this.tourId = this.activatedRoute.snapshot.queryParamMap.get("tourId");
    this.toursSubscription = this.tourService
      .getToursAsync()
      .subscribe((tours: Tour[]) => this.onResult(tours));
      window.scrollTo(0, 0);
  }
  ngDoCheck(): void {
    // 检测，并在发生 Angular 无法或不愿意自己检测的变化时作出反应。在每个 Angular 变更检测周期中调用，ngOnChanges() 和 ngOnInit() 之后。
  }
  ngAfterContentInit(): void {
    // 当把内容投影进组件之后调用。第一次 ngDoCheck() 之后调用，只调用一次。
  }
  ngAfterContentChecked(): void {
    // 每次完成被投影组件内容的变更检测之后调用。ngAfterContentInit() 和每次 ngDoCheck() 之后调用
  }
  ngAfterViewInit(): void {
    // 初始化完组件视图及其子视图之后调用。第一次 ngAfterContentChecked() 之后调用，只调用一次。
  }
  ngAfterViewChecked(): void {
    // 每次做完组件视图和子视图的变更检测之后调用。ngAfterViewInit() 和每次 ngAfterContentChecked() 之后调用。
  }
  ngOnDestroy() {
    // 当 Angular 每次销毁指令/组件之前调用并清扫。 在这儿反订阅可观察对象和分离事件处理器，以防内存泄漏。在 Angular 销毁指令/组件之前调用。
    if (this.toursSubscription) {
      this.toursSubscription.unsubscribe();
    }
  }

  initTrips() {
    if (this.tour.trips != null) {
      this.trip = Object.assign({}, this.tour.trips[0]);
      this.showSingleSupplement = this.tour.trips.some( c => c.tripSingleSupplement > 0);
      this.onSelectTrip(this.tour.trips[0]);
    }
  }
  onSelectTrip(trip: Trip) {
    this.trip = trip;
  }
  trackByTrips(index: number, trip: Trip): string {
    return trip.id;
  }
  private handleError(error: any): Promise<any> {
    this.router.navigateByUrl("/");
    console.error("An error occurred", error); // for demo purposes only
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
  gotoTraveller(tourId: string, tripId: string): void {
    // this.onSelectTrip(this.tour.trips.find(c => c.id === tripId));
    const url = "rooms?tourId=" + tourId + "&tripId=" + tripId;
    console.log(url);

    // console.log(this.el.nativeElement.id);
    // $("#myNav").parent().children("a").click();
    // window.open('/ENTOUR/rooms?tourId=CHG11&tripId=30004810', '_blank');
    // this.router.navigateByUrl("/rooms?tourId=CHG11&tripId=30004810");

    this.router.navigate(["/rooms"], {
      queryParams: { tourId: tourId, tripId: tripId }
    });
  }
}
