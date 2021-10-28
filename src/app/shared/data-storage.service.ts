import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs/operators";
import {Observable} from "rxjs";

import {environment} from "../../environments/environment";
import {AuthService} from "../auth/auth.service";
import {CabinetService} from "../cabinet/cabinet.service";
import {CabinetData} from "./cabinet-data.model";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient,
              private cabinetService: CabinetService,
              private authService: AuthService) {
  }

  storeCabinetData(cabinetId: string, cabinetData: CabinetData) {

    const userId = this.authService.user.value.id;

    const cabinetDataUrl = this.getCabinetDataUrl(userId, cabinetId);

    this.http.put(cabinetDataUrl, cabinetData)
      .subscribe(resp => console.log(resp));
  }

  fetchCabinetData(cabinetId: string) {
    this.fetchCabinetDataObservable(cabinetId)
      .subscribe();
  }

  fetchCabinetDataObservable(cabinetId: string): Observable<CabinetData> {

    const userId = this.authService.user.value.id;
    const cabinetDataUrl = this.getCabinetDataUrl(userId, cabinetId);

    return this.http.get<CabinetData>(cabinetDataUrl).pipe(
      tap(cabinetData => console.log(cabinetData)),
      // map(cabinetData => cabinetData
      //   .map(data => {
      //       return {...data, questions: data.questions ? data.ingredients : []};
      //     }
      //   )),
      // tap(cabinetData => this.cabinetService.setCabinetData(cabinetData))
    );
  }

  storeUserData(userData: any): Observable<any> {

    const userId = this.authService.user.value.id;

    const userDataUrl = this.getUserDataUrl(userId);
    console.log(userData);
    return this.http.put(userDataUrl, userData);
  }

  getUserData(): Observable<any> {
    const userId = this.authService.user.value.id;

    const userDataUrl = this.getUserDataUrl(userId);

    return this.http.get<any>(userDataUrl);
  }

  private getCabinetDataUrl(userId: string, cabinetId: string): string {
    return `${environment.firebaseUrl}/users/${userId}/cabinet/${cabinetId}.json`;
  }

  private getUserDataUrl(userId: string): string {
    return `${environment.firebaseUrl}/users/${userId}/data.json`;
  }


}
