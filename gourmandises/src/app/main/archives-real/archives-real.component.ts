import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { RealService } from 'src/app/services/real.service';
import { map } from 'rxjs/operators';
import { Real } from 'src/app/models/real';
import { AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-archives-real',
  templateUrl: './archives-real.component.html',
  styleUrls: ['./archives-real.component.css']
})
export class ArchivesRealComponent implements OnInit, OnDestroy {
  realizations: Real[];
  subscriptionNews: Subscription;

  constructor(private realService: RealService) {}

  ngOnInit() {
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
          this.realizations.reverse();
        },
        error => {
          console.log('Error to get realizations: ', error);
        }
      );
  }

  ngOnDestroy() {
    this.subscriptionNews.unsubscribe();
  }
}
