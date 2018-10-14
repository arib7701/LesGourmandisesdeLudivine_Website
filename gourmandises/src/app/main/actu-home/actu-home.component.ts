import { Component, OnInit, OnDestroy } from '@angular/core';
import { Actu } from 'src/app/models/actu';
import { Subscription } from 'rxjs';
import { ActuService } from 'src/app/services/actu.service';

@Component({
  selector: 'app-actu-home',
  templateUrl: './actu-home.component.html',
  styleUrls: ['./actu-home.component.css']
})
export class ActuHomeComponent implements OnInit, OnDestroy {
  lastActu: Actu;
  subscriptionNew: Subscription;

  constructor(public actuService: ActuService) {
    this.subscriptionNew = this.actuService
      .getLastActu()
      .valueChanges()
      .subscribe(lastActu => {
        this.lastActu = lastActu[0] as Actu;
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.subscriptionNew !== undefined) {
      this.subscriptionNew.unsubscribe();
    }
  }
}
