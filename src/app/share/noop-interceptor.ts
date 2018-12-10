import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";

import { Observable } from "rxjs";
import { tap, finalize } from "../../../node_modules/rxjs/operators";

/** Pass untouched request through to the next request handler. */
@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  //   constructor(private auth: AuthService, private messenger: MessageService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const started = Date.now();
    let ok: string;
    const secureReq = req.clone({
      url: req.url.replace("http://", "https://")
    });
    // const authReq = req.clone({
    //   headers: req.headers.set("Authorization", authToken)
    // });
    return next.handle(req).pipe(
      tap(
        // Succeeds when there is a response; ignore other events
        event => (ok = event instanceof HttpResponse ? "succeeded" : ""),
        // Operation failed; error is an HttpErrorResponse
        error => (ok = "failed")
      ),
      // Log when response observable either completes or errors
      finalize(() => {
        const elapsed = Date.now() - started;
        const msg = `${req.method} "${req.urlWithParams}"
             ${ok} in ${elapsed} ms.`;
        //   this.messenger.add(msg);
      })
    );
  }
}
