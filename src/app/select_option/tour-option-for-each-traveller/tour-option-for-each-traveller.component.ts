import { Component, OnInit, Input } from "@angular/core";
import { Traveller } from "../../Models/traveller";
import { Option } from "../../Models/option";
import { EnTourService } from "../../en-tour.service";

@Component({
  selector: "app-tour-option-for-each-traveller",
  templateUrl: "./tour-option-for-each-traveller.component.html",
  styleUrls: ["./tour-option-for-each-traveller.component.sass"]
})
export class TourOptionForEachTravellerComponent implements OnInit {
  @Input()
  traveller: Traveller;
  @Input()
  index: number;
  @Input()
  options: Option[];
  hasVisaOption: boolean;
  hasExtraHotelOption: boolean;
  constructor(private tourService: EnTourService) {}

  ngOnInit() {
    this.hasVisaOption = this.options.some( c => c.type === 20);
    this.hasExtraHotelOption = this.options.some( c => c.type === 10);
  }
  isTravellerOption(traveller: Traveller, option: Option) {
    if (traveller.selectedOptions != null) {
      return (
        traveller.selectedOptions.map(({ id }) => id).indexOf(option.id) >= 0
      );
    }
    return false;
  }
  // onVisaChanged(traveller: Traveller, needVisa: boolean) {
  //   traveller.needVisa = needVisa;
  //   this.tourService.updateRoomInfo();
  // }
  displayTitle(title: string) {
    this.tourService.openNgxModelDlg(title);
  }
  onInsuanceChanged(traveller: Traveller, needInsuance: boolean) {
    traveller.needInsuance = needInsuance;
    this.tourService.updateRoomInfo();
  }
  changeTravellerOption(traveller: Traveller, option: Option) {
    let changeSuccessful = false;

    if (traveller.selectedOptions && traveller.selectedOptions.find(c => c.id === option.id)) {
      traveller.selectedOptions = traveller.selectedOptions.filter(
        c => c.id !== option.id
      );
      changeSuccessful = true;
    }

    if (!changeSuccessful) {
      if (traveller.selectedOptions == null) {
        traveller.selectedOptions = new Array<Option>();
      }
      traveller.selectedOptions.push(option);
    }
    this.tourService.updateRoomInfo();
  }
}
