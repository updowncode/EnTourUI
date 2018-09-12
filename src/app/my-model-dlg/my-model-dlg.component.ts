import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-my-model-dlg",
  templateUrl: "./my-model-dlg.component.html",
  styleUrls: ["./my-model-dlg.component.sass"],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModal]
})
export class MyModelDlgComponent implements OnInit {
  closeResult: string;
  constructor(private modalService: NgbModal) {}
  @ViewChild('content') dlgContentRef: ElementRef;
  ngOnInit() {}
  openDlg() {
    this.open(this.dlgContentRef);
  }
  openBackDropCustomClass(content) {
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
  }

  openWindowCustomClass(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  openSm(content) {
    this.modalService.open(content, { size: 'sm' });
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg', backdrop: "static", keyboard: false  });
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title", backdrop: "static", keyboard: false })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
