import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable, of } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.router.url === "/") {
     // this.authService.isTourListHiden.pipe();
     // this.authService.isTourListHiden.subscribe();
    //  this.route.url
    //  .subscribe(url => console.log('The URL changed to: ' + url));
     return true;
    }
    return false;
  }
}
