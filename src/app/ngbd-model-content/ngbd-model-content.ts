import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngbd-modal-content',
  templateUrl: './ngbd-model-content.html'
})
// tslint:disable-next-line:component-class-suffix
export class NgbdModalContent {
  @Input() message;

  constructor(public activeModal: NgbActiveModal) {}
}
