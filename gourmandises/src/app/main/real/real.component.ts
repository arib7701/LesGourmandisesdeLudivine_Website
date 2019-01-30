import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RealService } from 'src/app/services/real.service';
import { map } from 'rxjs/operators';
import { Real } from 'src/app/models/real';
import * as moment from 'moment';
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
        this.reals.sort(this.sortByDate);
      });
  }

  sortByDate(a: Real, b: Real): number {
    moment.locale('fr');
    const dateA = moment(a.date, 'DD MMMM YYYY').toDate();
    const dateB = moment(b.date, 'DD MMMM YYYY').toDate();

    if (dateA < dateB) {
      return 1;
    } else if (dateA === dateB) {
      return 0;
    } else {
      return -1;
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.subscriptionReal !== undefined) {
      this.subscriptionReal.unsubscribe();
    }
  }
}
