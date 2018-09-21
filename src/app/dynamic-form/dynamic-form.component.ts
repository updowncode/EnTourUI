import { Component, OnInit, Input } from "@angular/core";
import { EnTourService } from "../en-tour.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  ValidatorFn
} from "@angular/forms";
@Component({
  selector: "app-dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.sass"]
})
export class DynamicFormComponent implements OnInit {
  user: FormGroup;
  customer: FormGroup;
  constructor(private es: EnTourService, private fb: FormBuilder) {}
// https://blog.csdn.net/feiying008/article/details/80412221
  ngOnInit() {
    this.user = new FormGroup(
      {
        email: new FormControl("", [
          Validators.required,
          Validators.pattern(
            /([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}/
          )
        ]),
        password: new FormControl("", [Validators.required]),
        repeat: new FormControl("", [Validators.required]),
        address: new FormGroup({
          province: new FormControl(""),
          city: new FormControl(""),
          area: new FormControl(""),
          addr: new FormControl("")
        })
      },
      this.validateEqual("password", "repeat")
    );
    this.customer = this.fb.group(
      {
        name: ["", [Validators.required]],
        addr: this.fb.group({
          city: []
        })
      },
      { validator: this.validateEqual("name", "addr.city") }
    );
  }
  onSubmit({ value, valid }) {
    if (!valid) {
      return;
    }
    console.log(value);
  }

  validateEqual(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        return { validateEqual: true };
      }
      return null;
    };
  }
}
