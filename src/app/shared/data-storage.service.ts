import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs/operators";
import {Observable} from "rxjs";

import {environment} from "../../environments/environment";
import {AuthService} from "../auth/auth.service";
import {CabinetService} from "../cabinet/cabinet.service";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient,
              private cabinetService: CabinetService,
              private authService: AuthService) {
  }

  storeCabinetData(cabinetData: any) {

    const cabinetDataUrl = this.getCabinetDataUrl();

    this.http.put(cabinetDataUrl, cabinetData)
      .subscribe(resp => console.log(resp));
  }

  fetchCabinetData() {
    this.fetchCabinetDataObservable()
      .subscribe();
  }

  fetchCabinetDataObservable(): Observable<any> {

    const cabinetDataUrl = this.getCabinetDataUrl();

    return this.http.get<any>(cabinetDataUrl).pipe(
      tap(cabinetData => console.log(cabinetData)),
      // map(cabinetData => cabinetData
      //   .map(data => {
      //       return {...data, questions: data.questions ? data.ingredients : []};
      //     }
      //   )),
      // tap(cabinetData => this.cabinetService.setCabinetData(cabinetData))
    );
  }

  private getCabinetDataUrl(): string {
    const email: string = 'user1';
    const cabinetId: string = 'russian';

    return `${environment.firebaseUrl}/${email}/cabinet/${cabinetId}.json`;
  }

}
