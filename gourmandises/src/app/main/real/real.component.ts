import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RealService } from 'src/app/services/real.service';
import { map } from 'rxjs/operators';
import { Real } from 'src/app/models/real';

@Component({
  selector: 'app-real',
  templateUrl: './real.component.html',
  styleUrls: ['./real.component.css']
})

// TO DO
// see can change presentation css
export class RealComponent implements OnInit, OnDestroy {
  reals: Real[];
  subscriptionReal: Subscription;

  constructor(public realService: RealService) {
    this.subscriptionReal = this.realService
      .getNews()
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
      )
      .subscribe(reals => {
        this.reals = [];
        reals.forEach(element => {
          const el = element;
          el['$key'] = element.key;
          this.reals.push(el as Real);
        });
        this.reals.reverse();
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptionReal.unsubscribe();
  }
}
