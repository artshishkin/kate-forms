import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";

import {AuthService} from "../auth/auth.service";
import {DataStorageService} from "../shared/data-storage.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  username: Observable<string>;

  private subs: Subscription[] = [];

  constructor(private authService: AuthService,
              private dataStorageService: DataStorageService) {
  }

  ngOnInit(): void {

    const userSub = this.authService.user.asObservable()
      .subscribe(user => this.isAuthenticated = !!user);
    this.subs.push(userSub);

    this.username = this.dataStorageService
      .getUserData()
      .pipe(map(userData => userData['person-name']));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onSaveData() {

  }

  onLoadData() {

  }

  onLogout() {
    this.authService.logout();
  }

}
