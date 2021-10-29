import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {User} from "./user.model";
import {Router} from "@angular/router";

import * as HttpErrorHandler from "../shared/http-error-handler";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);

  storage: Storage = localStorage;

  private tokenExpirationTimer: number;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.auth(environment.signUpUrl, email, password);
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.auth(environment.loginUrl, email, password);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    this.storage.removeItem('loggedInUser');
    if (this.tokenExpirationTimer)
      clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }

  autoLogin() {

    const userData = this.storage.getItem('loggedInUser');

    if (!userData) return;

    const data: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(userData);

    const expirationDate = new Date(data._tokenExpirationDate);
    const loggedInUser: User =
      new User(data.email, data.id, data._token, expirationDate);

    if (loggedInUser.token) {
      this.user.next(loggedInUser);
      this.autoLogout(expirationDate.getTime() - new Date().getTime());
    }
  }

  autoLogout(expirationDuration: number) {

    console.log(`Token expiration duration: ${expirationDuration}`);

    if (this.tokenExpirationTimer)
      clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = window.setTimeout(() => {
      this.logout();
    }, expirationDuration);
  };

  private auth(url: string, email: string, password: string): Observable<AuthResponseData> {

    const requestBody = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    return this.http.post<AuthResponseData>(url, requestBody)
      .pipe(
        catchError(HttpErrorHandler.handleError),
        tap(this.storeLoggedInUserData.bind(this))
      );
  }

  private storeLoggedInUserData(authResponse: AuthResponseData) {
    const expirationDate: Date = new Date(new Date().getTime() + 1000 * (+authResponse.expiresIn));
    const loggedInUser = new User(authResponse.email, authResponse.localId, authResponse.idToken, expirationDate);
    console.log(loggedInUser);
    this.user.next(loggedInUser);
    this.autoLogout(+authResponse.expiresIn * 1000);
    this.storage.setItem('loggedInUser', JSON.stringify(loggedInUser));
  }

}

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
