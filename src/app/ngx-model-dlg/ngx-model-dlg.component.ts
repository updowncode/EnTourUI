import { Component, OnInit, Input } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-ngx-model-dlg",
  templateUrl: "./ngx-model-dlg.component.html",
  styleUrls: ["./ngx-model-dlg.component.sass"]
})
export class NgxModelDlgComponent {
  title: string;
  msg: string;
  closeBtnName: string;

  constructor(public bsModalRef: BsModalRef) {}
}
