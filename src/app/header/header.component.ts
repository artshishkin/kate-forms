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

  private userSub: Subscription;
  isAuthenticated = false;
  username: Observable<string>;

  constructor(private authService: AuthService,
              private dataStorageService: DataStorageService) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.asObservable()
      .subscribe(user => this.isAuthenticated = !!user);
    this.username = this.dataStorageService
      .getUserData()
      .pipe(map(userData => userData['person-name']));
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSaveData() {

  }

  onLoadData() {

  }

  onLogout() {
    this.authService.logout();
  }

}
