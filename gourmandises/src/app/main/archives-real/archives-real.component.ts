import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RealService } from 'src/app/services/real.service';
import { map } from 'rxjs/operators';
import { Real } from 'src/app/models/real';
import * as moment from 'moment';
@Component({
  selector: 'app-archives-real',
  templateUrl: './archives-real.component.html',
  styleUrls: ['./archives-real.component.css']
})
export class ArchivesRealComponent implements OnInit, OnDestroy {
  realizations: Real[];
  subscriptionNews: Subscription;

  constructor(private realService: RealService) {
    this.subscriptionNews = this.realService
      .getAllNews()
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
      )
      .subscribe(
        real => {
          this.realizations = [];
          real.forEach(element => {
            const el = element;
            el['$key'] = element.key;
            this.realizations.push(el as Real);
          });
          this.realizations.sort(this.sortByDate);
        },
        error => {
          console.log('Error to get realizations: ', error);
        }
      );
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
    this.subscriptionNews.unsubscribe();
  }
}
