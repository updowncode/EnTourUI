import {
  Component,
  OnInit,
  Input,
  HostBinding,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewChecked,
  AfterViewInit,
  AfterContentChecked,
  AfterContentInit,
  DoCheck,
  OnChanges,
  SimpleChanges,
  ContentChild
} from "@angular/core";
import { Traveller } from "../../Models/traveller";
import { Room } from "../../Models/room";
import { Trip } from "../../Models/trip";
import { slideInDownAnimation } from "../../app.animations";
import { EnTourService } from "../../en-tour.service";
import { Subscription } from "rxjs";
// tslint:disable-next-line:max-line-length
import { TourRoomsEachRoomEachTravellerChildComponent } from "../tour-rooms-each-room-each-traveller-child/tour-rooms-each-room-each-traveller-child.component";
import { RoomCfg } from "../../Models/room-cfg";

@Component({
  selector: "app-tour-rooms-each-room-each-traveller",
  templateUrl: "./tour-rooms-each-room-each-traveller.component.html",
  styleUrls: ["./tour-rooms-each-room-each-traveller.component.sass"],
  animations: [slideInDownAnimation]
})
export class TourRoomsEachRoomEachTravellerComponent
  implements
    OnChanges,
    OnInit,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    OnDestroy {
  @HostBinding("@routeAnimation")
  routeAnimation = true;
  @HostBinding("style.display")
  display = "block";
  @HostBinding("style.position")
  position = "related";
  @Input()
  traveller: Traveller;
  @Input()
  room: Room;
  @Input()
  trip: Trip;
  @Input()
  roomIndex: number;
  @Input()
  roomsMoveTo: Room[];
  @Input()
  bedRoomsForSelectedTravellers: Room[];
  @Output()
  roomMovedToRequest = new EventEmitter<boolean>();
  @Output()
  roomChangedToRequest = new EventEmitter<any>();
  constructor(private tourService: EnTourService) {}
  showRoomInfo: boolean;
  newBedRoom: Room;
  subscription: Subscription;
  @ContentChild(TourRoomsEachRoomEachTravellerChildComponent)
  contentChild: TourRoomsEachRoomEachTravellerChildComponent;
  ngOnChanges(changes: SimpleChanges): void {
    // 当 Angular（重新）设置数据绑定输入属性时响应。 该方法接受当前和上一属性值的 SimpleChanges 对象当被绑定的输入属性的值发生变化时调用，首次调用一定会发生在 ngOnInit() 之前。
    for (const propName in changes) {
      if (propName === "traveller") {
        const chng = changes[propName];
        const cur = JSON.stringify(chng.currentValue);
        const prev = JSON.stringify(chng.previousValue);
        console.log(
          `${propName}: currentValue = ${cur}, previousValue = ${prev}`
        );
      }
    }
  }
  compareFn(c1: RoomCfg, c2: RoomCfg): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  ngOnInit(): void {
    // 在 Angular 第一次显示数据绑定和设置指令/组件的输入属性之后，初始化指令/组件。在第一轮 ngOnChanges() 完成之后调用，只调用一次。
    // this.tourId = this.activatedRoute.snapshot.paramMap.get("id");
    this.updateRoomInfo();
    this.room.selectedRoomCfg = this.room.roomCfgList.find( c => c.id === -1);
    // this.initData();
  }
  ngDoCheck(): void {
    // 检测，并在发生 Angular 无法或不愿意自己检测的变化时作出反应。在每个 Angular 变更检测周期中调用，ngOnChanges() 和 ngOnInit() 之后。
    // if (this.traveller.firstName !== this.room.travellers[0].firstName) {
    //   console.log(
    //     `this.traveller.firstName:"${
    //       this.traveller.firstName
    //     }", room first traveller firstName is"${
    //       this.room.travellers[0].firstName
    //     }"`
    //   );
    // }
  }
  ngAfterContentInit(): void {
    // 当把内容投影进组件之后调用。第一次 ngDoCheck() 之后调用，只调用一次。
    // console.log(
    //   `AfterContentInit: this passenger index: "${
    //     this.contentChild.traveller.id
    //   }"`
    // );
  }
  ngAfterContentChecked(): void {
    // 每次完成被投影组件内容的变更检测之后调用。ngAfterContentInit() 和每次 ngDoCheck() 之后调用
    // console.log(
    //   `ngAfterContentChecked: this passenger index: "${this.traveller.id}"`
    // );
  }

  ngOnDestroy() {
    // 当 Angular 每次销毁指令/组件之前调用并清扫。 在这儿反订阅可观察对象和分离事件处理器，以防内存泄漏。在 Angular 销毁指令/组件之前调用。
  }
  initData() {
    for (let i = 0; i < this.room.travellers.length; i++) {
      this.room.travellers[i].firstName =
        "firstName" +
        (
          this.totalTravellersBeforeRoom(this.room.index - 1) +
          i +
          1
        ).toString();
      this.room.travellers[i].lastName =
        "lastName" +
        (
          this.totalTravellersBeforeRoom(this.room.index - 1) +
          i +
          1
        ).toString();
    }
  }
  onBedConfigModelChange(roomIndex: number, newRoom: Room) {
    this.roomChangedToRequest.emit({ roomIndex: roomIndex, newRoom: newRoom });
  }
  onSmokingSelectionChange(room: Room, smokingRoom: number) {
    room.smokingRoom = smokingRoom;
  }
  onTravellerIsChildChange(traveller: Traveller, isChild: boolean) {
    traveller.isChild = isChild;
    this.tourService.updateRoomInfo();
  }

  updateRoomInfo() {
    if (
      this.traveller !== undefined &&
      this.traveller === this.room.travellers[0]
    ) {
      this.showRoomInfo = true;
      this.reSortBedConfig();
      this.newBedRoom = this.bedRoomsForSelectedTravellers[0];
    } else {
      this.showRoomInfo = false;
    }
    this.room.roomCfgList.forEach(c => (c.roomIndex = this.room.index));
  }
  reSortBedConfig() {
    const newBedRoomsForSelectedTravellers: Room[] = [];
    for (let j = 0; j < this.bedRoomsForSelectedTravellers.length; j++) {
      if (this.bedRoomsForSelectedTravellers[j].id === this.room.id) {
        newBedRoomsForSelectedTravellers.push(
          this.bedRoomsForSelectedTravellers[j]
        );
        break;
      }
    }
    for (let j = 0; j < this.bedRoomsForSelectedTravellers.length; j++) {
      if (this.bedRoomsForSelectedTravellers[j].id !== this.room.id) {
        newBedRoomsForSelectedTravellers.push(
          this.bedRoomsForSelectedTravellers[j]
        );
      }
    }
    this.bedRoomsForSelectedTravellers = Object.assign(
      [],
      newBedRoomsForSelectedTravellers
    );
  }
  onRoomMovedToModelChange(traveller: Traveller, roomIndex: number) {
    for (let i = this.trip.rooms.length - 1; i >= 0; i--) {
      this.trip.rooms[i].travellers = this.trip.rooms[i].travellers.filter(
        c => c.id !== traveller.id
      );
      // for (let j = this.trip.rooms[i].travellers.length - 1; j >= 0; j--) {
      //   if (this.trip.rooms[i].travellers[j].id === traveller.id) {
      //     this.trip.rooms[i].travellers.splice(j, 1);
      //   }
      // }
    }

    traveller.roomId = this.trip.rooms.find(c => c.index === roomIndex).id;
    this.trip.rooms.find(c => c.index === roomIndex).travellers.push(traveller);

    // for (let i = this.trip.rooms.length - 1; i >= 0; i--) {
    //   if (this.trip.rooms[i].index === roomIndex) {
    //     traveller.roomId = this.trip.rooms[i].id;
    //     this.trip.rooms[i].travellers.push(traveller);
    //   }
    // }

    this.trip.rooms.forEach((r: Room, i: number, s: Room[]) =>
      r.travellers.forEach((t: Traveller, j: number, ts: Traveller[]) => {
        t.id = this.totalTravellersBeforeRoom(i) + j;
      })
    );
    // for (let i = 0; i < this.trip.rooms.length; i++) {
    //   for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
    //     this.trip.rooms[i].travellers[j].id =
    //       this.totalTravellersBeforeRoom(i) + j;
    //   }
    // }

    this.roomMovedToRequest.emit(true);
  }
  totalTravellersBeforeRoom(index: number): number {
    let total = 0;
    if (index > 0) {
      for (let i = 0; i < index; i++) {
        for (let j = 0; j < this.trip.rooms[i].travellers.length; j++) {
          total++;
        }
      }
    }
    return total;
  }
}
