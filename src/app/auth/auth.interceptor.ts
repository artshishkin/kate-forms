import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {exhaustMap, take} from "rxjs/operators";
import {environment} from "../../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.startsWith(environment.firebaseUrl) && request.url.indexOf('/cabinet') > 0) {
      return this.authService.user.pipe(
        take(1),
        exhaustMap(
          user => {
            const token = user?.token;
            const clone = request.clone({setParams: {auth: `${token}`}});
            return next.handle(clone);
          }
        )
      );
    } else {
      return next.handle(request);
    }
  }
}
