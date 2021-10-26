import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CabinetService {

  names: Map<string, string> = new Map<string, string>();

  constructor() {
    this.names.set('russian', 'Кабинет для реализации предметной области «Русский язык и литература»');
    this.names.set('foreign', 'Кабинет иностранных языков');
  }

  getName(cabinetId: string): string {
    return this.names.get(cabinetId);
  }
}
