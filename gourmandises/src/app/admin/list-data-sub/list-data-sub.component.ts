import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FlashMessagesService } from 'angular2-flash-messages';
import { map } from 'rxjs/operators';
import { AngularFireList } from 'angularfire2/database';
import { RecipeService } from 'src/app/services/recipe.service';
import { RealService } from 'src/app/services/real.service';
import { ActuService } from 'src/app/services/actu.service';
import { PartnerService } from 'src/app/services/partner.service';
import { GalleryService } from 'src/app/services/gallery.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { Real } from 'src/app/models/real';
import { OrdersService } from 'src/app/services/orders.service';
import { isFormattedError } from '@angular/compiler';

@Component({
  selector: 'app-list-data-sub',
  templateUrl: './list-data-sub.component.html',
  styleUrls: ['./list-data-sub.component.css']
})
export class ListDataSubComponent implements OnInit, OnDestroy {
  @Input()
  dataType: string;

  datas: any[];
  data: any;
  title: string;
  url: string;

  // Paginations
  page: Number = 1;

  // Subscription
  subscription: Subscription;
  subscriptionDelete: Subscription;

  constructor(
    private recipeService: RecipeService,
    private realService: RealService,
    private actuService: ActuService,
    private partnerService: PartnerService,
    private galleryService: GalleryService,
    private ordersService: OrdersService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    switch (this.dataType) {
      case 'recipes': {
        this.title = 'Recettes';
        this.url = 'url(../assets/img/edit_recipe.jpg)';
        this.subscription = this.recipeService
          .getAllRecipes()
          .snapshotChanges()
          .pipe(
            map(actions =>
              actions.map(a => ({ key: a.key, ...a.payload.val() }))
            )
          )
          .subscribe(datas => {
            this.datas = [];
            datas.forEach(element => {
              this.datas.push(element as any);
            });
            this.datas.reverse();
          });

        break;
      }
      case 'real': {
        this.title = 'Realisations';
        this.url = 'url(../assets/img/edit_real.jpg)';
        this.subscription = this.realService
          .getAllNews()
          .snapshotChanges()
          .pipe(
            map(actions =>
              actions.map(a => ({ key: a.key, ...a.payload.val() }))
            )
          )
          .subscribe(datas => {
            this.datas = [];
            datas.forEach(element => {
              this.datas.push(element as any);
            });
            this.datas.reverse();
          });
        break;
      }
      case 'partners': {
        this.title = 'Partenaires / Produits';
        this.url =
          // tslint:disable-next-line:max-line-length
          'url(../assets/img/edit_partner.jpg)';
        this.subscription = this.partnerService
          .getAllPartners()
          .snapshotChanges()
          .pipe(
            map(actions =>
              actions.map(a => ({ key: a.key, ...a.payload.val() }))
            )
          )
          .subscribe(datas => {
            this.datas = [];
            datas.forEach(element => {
              this.datas.push(element as any);
            });
            this.datas.reverse();
          });
        break;
      }
      case 'actu': {
        this.title = 'Actualités';
        this.url = 'url(../assets/img/topnew.jpg)';
        this.subscription = this.actuService
          .getAllActu()
          .snapshotChanges()
          .pipe(
            map(actions =>
              actions.map(a => ({ key: a.key, ...a.payload.val() }))
            )
          )
          .subscribe(datas => {
            this.datas = [];
            datas.forEach(element => {
              this.datas.push(element as any);
            });
            this.datas.reverse();
          });
        break;
      }
      case 'gallery': {
        this.title = `Catégories d'Images`;
        this.url = 'url(../assets/img/edit_gal.jpg)';
        this.subscription = this.galleryService
          .getAllGallery()
          .snapshotChanges()
          .pipe(
            map(actions =>
              actions.map(a => ({ key: a.key, ...a.payload.val() }))
            )
          )
          .subscribe(datas => {
            this.datas = [];
            datas.forEach(element => {
              this.datas.push(element as any);
            });
          });
        break;
      }
      case 'orders': {
        this.title = `Commandes`;
        this.url = 'url(../assets/img/edit_orders.jpg)';
        this.subscription = this.ordersService
          .getAllOrders()
          .snapshotChanges()
          .pipe(
            map(actions =>
              actions.map(a => ({ key: a.key, ...a.payload.val() }))
            )
          )
          .subscribe(datas => {
            this.datas = [];
            datas.forEach(element => {
              this.datas.push(element as any);
            });
          });
        break;
      }
    }
  }

  // Delete Picture From Storage
  deleteImgStorage(data: any) {
    if (data.img === undefined) {
    } else {
      this.storage
        .refFromURL(data.img)
        .delete()
        .toPromise()
        .then(() => {})
        .catch(err => {
          console.log('Error removing old picture');
        });
    }
  }

  // Delete Partner in associated Realization
  deletePartnerReal(real: Real, realId: string, partnerKey: string) {

    if (real !== null) {
      if (real.partnersId !== undefined) {
        const partners: any = real.partnersId;
        if (partners.length > 0) {
          for (let i = 0; i < partners.length; i++) {
            if (partners[i] === partnerKey) {
              partners.splice(i, 1);
            }
          }
        }
        // Update realization galleryId
        real.partnersId = partners;
      }

      // Update Realization in DB
      this.realService.editReal(realId, real as Real[]);
    }
  }

  onDeleteClick(type: string, id: string, index: number) {
    if (confirm('Etes-vous sure de vouloir supprimer cette donnée?')) {
      switch (type) {
        case 'recipes': {
          this.recipeService.deleteRecipe(id);
          break;
        }
        case 'real': {
          if (
            confirm(
              'Attention, les images ET les sponsors devront etre supprimées manuellement dans les parties admin associées.'
            )
          ) {
            this.realService.deleteReal(id);
          }
          break;
        }
        case 'partners': {
          // Get Id of Realization using Img
          this.data = this.datas[index];
          for (let i = 0; i < this.data.realId.length; i++) {
            this.subscriptionDelete = this.realService
              .getNewsById(this.data.realId[i])
              .valueChanges()
              .subscribe(real => {
                // Delete Partner from Realization
                this.deletePartnerReal(real, this.data.realId[i], id);
                this.partnerService.deletePartner(id);
              });
          }
          break;
        }
        case 'actu': {
          // Get url of Img
          this.subscriptionDelete = this.actuService
            .getOneActuById(id)
            .valueChanges()
            .subscribe(actu => {
              // Delete Img from Storage
              this.deleteImgStorage(actu);
              this.actuService.deleteActu(id);
            });
          break;
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }

    if (this.subscriptionDelete !== undefined) {
      this.subscriptionDelete.unsubscribe();
    }
  }
}
