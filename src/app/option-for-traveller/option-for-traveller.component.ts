import { Component, OnInit, Input } from "@angular/core";
import { Traveller } from "../Models/traveller";
import { Option } from "../Models/option";

@Component({
  selector: "app-option-for-traveller",
  templateUrl: "./option-for-traveller.component.html",
  styleUrls: ["./option-for-traveller.component.sass"]
})
export class OptionForTravellerComponent implements OnInit {
  @Input() traveller: Traveller;
  @Input() index: number;
  @Input() options: Option[];
  constructor() {}

  ngOnInit() {}
  isTravellerOption(traveller: Traveller, option: Option) {
    if (traveller.selectedOptions != null) {
      return traveller.selectedOptions.map(({ id }) => id).indexOf(option.id) >= 0;
    }
    return false;
  }
  changeTravellerOption(traveller: Traveller, option: Option) {
    let changeSuccessful = false;
    if (traveller.selectedOptions != null) {
      for (let i = traveller.selectedOptions.length - 1; i >= 0; i--) {
        if (traveller.selectedOptions[i].id === option.id) {
          traveller.selectedOptions.splice(i, 1);
          changeSuccessful = true;
          break;
        }
      }
    }
    if (!changeSuccessful) {
      if (traveller.selectedOptions == null) {
        traveller.selectedOptions = new Array<Option>();
      }
      traveller.selectedOptions.push(option);
    }
  }
}
