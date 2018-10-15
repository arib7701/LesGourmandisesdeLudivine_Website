import { Component, OnInit, OnDestroy } from '@angular/core';
import { Real } from 'src/app/models/real';
import { Subscription } from 'rxjs';
import { RealService } from 'src/app/services/real.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-real-list',
  templateUrl: './real-list.component.html',
  styleUrls: ['./real-list.component.css']
})
export class RealListComponent implements OnInit, OnDestroy {
  realizations: Real[];
  real: Real;
  realId: string;

  // Paginations
  realPage: Number = 1;

  // Subscription
  subscriptionNew: Subscription;

  constructor(
    private realService: RealService,
    private flashService: FlashMessagesService
  ) {}

  ngOnInit() {
    this.subscriptionNew = this.realService
      .getAllNews()
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
      )
      .subscribe(realizations => {
        this.realizations = [];
        realizations.forEach(element => {
          this.realizations.push(element as Real);
        });
        this.realizations.reverse();
      });
  }

  onDeleteClick(type, id) {
    if (confirm('Etes-vous sure de vouloir supprimer cette donnée?')) {
      // Delete Realization
      if (type === 'real') {
        if (
          confirm(
            'Attention, les images ET les sponsors devront etre supprimées manuellement dans les parties admin associées.'
          )
        ) {
          this.realService.deleteReal(id);
          this.flashService.show('Réalisation Supprimée', {
            cssClass: 'valid-feedback',
            timeout: 4000
          });
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.subscriptionNew !== undefined) {
      this.subscriptionNew.unsubscribe();
    }
  }
}
