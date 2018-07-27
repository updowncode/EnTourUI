import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private displayNavBar = new BehaviorSubject(false);
  navbar = this.displayNavBar.asObservable();
  constructor() {}
  showNavbar(isHiden: boolean) {
    this.displayNavBar.next(isHiden);
  }
}
