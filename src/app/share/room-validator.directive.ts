import { Directive, Input } from "@angular/core";
import {
  AbstractControl,
  FormGroup,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn
} from "@angular/forms";
import { Trip } from "../Models/trip";
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: "[roomsValidation]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: RoomValidatorDirective,
      multi: true
    }
  ]
})
export class RoomValidatorDirective implements Validator {
  // tslint:disable-next-line:no-input-rename
  @Input("roomsValidation")
  trip: Trip;
  customValidator: ValidatorFn = (
    control: FormGroup
  ): ValidationErrors | null => {
    return this.onValidation(control);
  }
  validate(control: AbstractControl): ValidationErrors {
    return this.customValidator(control);
  }
  onValidation(control: FormGroup): ValidationErrors | null {
    const t = this.trip;
    if (
      t !== undefined &&
      t.billingInfo !== undefined &&
      t.billingInfo.firstName === "david" &&
      t.billingInfo.lastName === "li"
    ) {
      return { identityRevealed: true };
    }
    return null;
  }
}
