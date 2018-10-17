import { Component, OnInit, OnDestroy } from '@angular/core';
import { Gallery } from 'src/app/models/gallery';
import { Real } from 'src/app/models/real';
import { Subscription } from 'rxjs';
import { GalleryService } from 'src/app/services/gallery.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from 'angularfire2/storage';
import { map } from 'rxjs/operators';
import { RealService } from 'src/app/services/real.service';

@Component({
  selector: 'app-gallery-edit',
  templateUrl: './gallery-edit.component.html',
  styleUrls: ['./gallery-edit.component.css']
})
export class GalleryEditComponent implements OnInit, OnDestroy {
  category: string;
  imgs: Gallery[];
  real: Real;
  subscriptionNew: Subscription;
  subscriptionGal: Subscription;

  constructor(
    private galleryService: GalleryService,
    private realService: RealService,
    private route: ActivatedRoute,
    private storage: AngularFireStorage
  ) {
    this.real = new Real();
    this.real.img = {};
    this.imgs = new Array<Gallery>();
  }

  ngOnInit() {
    this.category = this.route.snapshot.paramMap.get('cat');

    this.subscriptionGal = this.galleryService
      .getOneGallery(this.category)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
      )
      .subscribe(imgs => {
        this.imgs = [];
        imgs.forEach(element => {
          this.imgs.push(element as Gallery);
        });
        this.imgs.reverse();
      });
  }

  // Delete Picture From Storage
  deleteImgStorage(img: string) {
    if (img !== undefined) {
      this.storage
        .refFromURL(img)
        .delete()
        .toPromise()
        .then(() => {})
        .catch(err => {
          console.log('Error removing old picture');
        });
    }
  }

  // Delete Img in associated Realization
  deleteImgReal(
    real: Real,
    realId: string,
    imgKey: string,
    principale: boolean
  ) {
    // For Non Principale Img
    if (principale === false && real.galleryId !== undefined) {
      const gallery: any = real.galleryId;
      if (gallery.length > 0) {
        for (let i = 0; i < gallery.length; i++) {
          if (gallery[i] === imgKey) {
            gallery.splice(i, 1);
          }
        }
      }

      // Update realization galleryId
      real.galleryId = gallery;
    } else if (principale) {
      // For Principale Img
      // Remove img of Realization
      real.img = {
        url: '',
        id: ''
      };
    }

    // Update Realization in DB
    this.realService.editReal(realId, real as Real[]);
  }

  deleteFromGal(category: string, img: Gallery, principale: boolean) {
    // Delete from Gallery
    this.galleryService.deletePhotoInGallery(category, img.key);

    // Delete from Storage
    this.deleteImgStorage(img.img);

    // Get Id of Realization using Img
    this.subscriptionNew = this.realService
      .getNewsById(img.newsLink)
      .valueChanges()
      .subscribe(realObject => {
        this.real = realObject;
        // Delete Img from Realization
        this.deleteImgReal(this.real, img.newsLink, img.key, principale);
      });
  }

  onDelete(principale: boolean, img: Gallery) {
    if (confirm('Etes-vous sure de vouloir supprimer cette photo?')) {
      if (principale) {
        if (
          confirm(
            'Attention, supprimer cette image entrainera une perte de donnees pour la realisation associee,' +
              'si vous etes certain de votre choix, il faudra choisir une image de replacement.'
          )
        ) {
          this.deleteFromGal(this.category, img, true);
        }
      } else {
        this.deleteFromGal(this.category, img, false);
      }
    }
  }

  ngOnDestroy() {
    if (this.subscriptionGal !== undefined) {
      this.subscriptionGal.unsubscribe();
    }

    if (this.subscriptionNew !== undefined) {
      this.subscriptionNew.unsubscribe();
    }
  }
}
