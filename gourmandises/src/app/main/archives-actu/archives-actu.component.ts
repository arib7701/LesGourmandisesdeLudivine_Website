import { Component, OnInit, OnDestroy } from '@angular/core';
import { Actu } from 'src/app/models/actu';
import { Subscription } from 'rxjs';
import { ActuService } from 'src/app/services/actu.service';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
@Component({
  selector: 'app-archives-actu',
  templateUrl: './archives-actu.component.html',
  styleUrls: ['./archives-actu.component.css']
})
export class ArchivesActuComponent implements OnInit, OnDestroy {
  actus: Actu[];
  subscriptionActus: Subscription;

  constructor(private actuService: ActuService) {
    this.subscriptionActus = this.actuService
      .getAllActu()
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
      )
      .subscribe(
        actus => {
          this.actus = [];
          actus.forEach(element => {
            const el = element;
            el['$key'] = element.key;
            this.actus.push(el as Actu);
          });
          this.actus.sort(this.sortByDate);
        },
        error => {
          console.log('Error to get actus: ', error);
        }
      );
  }

  sortByDate(a: Actu, b: Actu): number {
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
    this.subscriptionActus.unsubscribe();
  }
}
