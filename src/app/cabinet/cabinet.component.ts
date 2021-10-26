import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CabinetService} from "./cabinet.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css']
})
export class CabinetComponent implements OnInit, OnDestroy {

  cabinetId: string = null;
  cabinetName: string = null;

  private subs: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private cabinetService: CabinetService) {
  }

  ngOnInit(): void {

    this.cabinetId = this.route.snapshot.paramMap.get('id');
    this.cabinetName = this.cabinetService.getName(this.cabinetId);

    let subscription = this.route.paramMap.subscribe(paramMap => {
      this.cabinetId = paramMap.get('id');
      this.cabinetName = this.cabinetService.getName(this.cabinetId);
    });
    this.subs.push(subscription);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
