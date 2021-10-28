import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

import {CabinetData} from "../shared/cabinet-data.model";
import {DataStorageService} from "../shared/data-storage.service";

@Injectable({
  providedIn: 'root'
})
export class CabinetDataResolver implements Resolve<CabinetData> {

  constructor(private dataStorageService: DataStorageService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CabinetData> | Promise<CabinetData> | CabinetData {

    let cabinetId = route.paramMap.get('id');
    return this.dataStorageService.fetchCabinetDataObservable(cabinetId);
  }
}
