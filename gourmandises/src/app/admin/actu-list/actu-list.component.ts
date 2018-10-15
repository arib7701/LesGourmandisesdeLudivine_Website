import { Component, OnInit, OnDestroy } from '@angular/core';
import { Actu } from 'src/app/models/actu';
import { Subscription } from 'rxjs';
import { ActuService } from 'src/app/services/actu.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AngularFireStorage } from 'angularfire2/storage';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-actu-list',
  templateUrl: './actu-list.component.html',
  styleUrls: ['./actu-list.component.css']
})
export class ActuListComponent implements OnInit, OnDestroy {
  actus: Actu[];
  actu: Actu;

  // Paginations
  actuPage = 1;

  // Subscription
  subscriptionActu: Subscription;
  subscriptionActuDelete: Subscription;

  constructor(
    private actuService: ActuService,
    private flashService: FlashMessagesService,
    private storage: AngularFireStorage
  ) {
    this.subscriptionActu = this.actuService
      .getAllActu()
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
      )
      .subscribe(actus => {
        this.actus = [];
        actus.forEach(element => {
          this.actus.push(element as Actu);
        });
        this.actus.reverse();
      });
  }

  ngOnInit() {}

  // Delete Picture From Storage
  deleteImgStorage(actu) {
    console.log('into deleteImgStorage - url ' + actu);

    if (actu.img !== undefined) {
      this.storage
        .refFromURL(actu.img)
        .delete()
        .toPromise()
        .then(() => {})
        .catch(err => {
          console.log('Error removing old picture');
        });
    }
  }

  onDeleteClick(type, id) {
    if (confirm('Etes-vous sure de vouloir supprimer cette donnée?')) {
      // Delete Actuality
      if (type === 'actu') {
        // Get url of Img
        this.subscriptionActuDelete = this.actuService
          .getOneActuById(id)
          .valueChanges()
          .subscribe(actu => {
            this.actu = actu;

            // Delete Img from Storage
            this.deleteImgStorage(this.actu);
          });

        this.actuService.deleteActu(id);
        this.flashService.show('Actualité Supprimée', {
          cssClass: 'valid-feedback',
          timeout: 4000
        });
      }
    }
  }

  ngOnDestroy() {
    if (this.subscriptionActu !== undefined) {
      this.subscriptionActu.unsubscribe();
    }

    if (this.subscriptionActuDelete !== undefined) {
      this.subscriptionActuDelete.unsubscribe();
    }
  }
}
