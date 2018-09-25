import { Component, OnInit, Input } from "@angular/core";
import { EnTourService } from "../en-tour.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
  AsyncValidatorFn
} from "@angular/forms";
@Component({
  selector: "app-dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.sass"]
})
export class DynamicFormComponent implements OnInit {
  user: FormGroup;
  customer: FormGroup;
  guest: FormGroup;
  userList = ["jack", "mary", "jimi", "tom"];
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
        name: ["", [Validators.required], this.checkNameValidator()],
        addr: this.fb.group({
          city: []
        })
      },
      { validator: this.validateEqual("name", "addr.city") }
    );
    this.guest = this.fb.group({});
    this.guest.addControl("guest1", this.fb.control(""));
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

  checkNameValidator = () => {
    return (control: AbstractControl) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (this.userList.indexOf(control.value) >= 0) {
            resolve({
              checkName: control.value
            });
          } else {
            resolve(null);
          }
        }, 2000);
      });
  }
//   在包含有formGroup指令的元素的子节点上，可以使用formControlName="name"代替[formControl]="name"来控制表单元素，formControlName指令只能在formGroup指令内部使用。
// 在FormGroup上可以通过info.get('name')获取FormControl实例。
//   <div [style.color]="'red'" *ngIf="name.invalid && (name.touched || name.dirty)">
//   <p *ngIf="name.errors.required">Name can not be empty!</p>
//   <p *ngIf="name.errors.checkName">Name is exist!</p>
// </div>

// this.address = this.fb.array([]);
// this.info = this.fb.group({
//   address:this.address
// });
// addAddress() {
//   this.address.push(new FormGroup({
//     provience:new FormControl(),
//     city:new FormControl()
//   }));
// }

// /**
//  * 移除地址
//  * @param index
//  */
// removeAddress(index) {
//   this.address.removeAt(index);
// }
// <div><button (click)="addAddress()">Add</button></div>
// <div *ngFor="let address of info.get('address').controls;let index=index">
//   <p>
//     Provience:<input [formControl]="address.get('provience')">
//     City:<input [formControl]="address.get('city')">
//     <button (click)="removeAddress(index)">Remove</button>
//   </p>
// </div>
}
