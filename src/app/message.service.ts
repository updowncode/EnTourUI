import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/add/observable/of";
@Injectable({
  providedIn: "root"
})
export class MessageService {
  private subject = new Subject<any>();
  add(message: string): Observable<boolean> {
    this.subject.next({ text: message });
    return Observable.of(true);
  }
  sendMessage(message: string) {
    this.subject.next({ text: message });
  }
  clearMessage() {
    this.subject.next();
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
