import { Component, OnInit, OnDestroy } from '@angular/core';
import { GalleryService } from 'src/app/services/gallery.service';
import { PartnerService } from 'src/app/services/partner.service';
import { Partner } from 'src/app/models/partner';
import { Gallery } from 'src/app/models/gallery';
import { Real } from 'src/app/models/real';
import { Subscription } from 'rxjs';
import { RealService } from 'src/app/services/real.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-real-detail',
  templateUrl: './real-detail.component.html',
  styleUrls: ['./real-detail.component.css']
})

// TO DO
// review css of list of partners
export class RealDetailComponent implements OnInit, OnDestroy {
  options = { year: 'numeric', month: 'long', day: 'numeric' };
  id: string;
  likesDisabled: Boolean = false;
  photo: string;
  partner: Partner;
  galleryImg: Gallery[];
  partnersArray: Partner[];
  display: string;

  comment = {
    date: '',
    name: '',
    mess: ''
  };

  real: Real;
  prevReal: Real;
  nextReal: Real;
  prevNewId: string;
  nextNewId: string;

  // Subscriptions
  subscriptionRoute: Subscription;
  subscriptionPartner: Subscription;
  subscriptionNews: Subscription;
  subscriptionGal: Subscription;
  subscriptionPrev: Subscription;
  subscriptionNext: Subscription;

  constructor(
    private realService: RealService,
    private galleryService: GalleryService,
    private parternService: PartnerService,
    private route: ActivatedRoute,
    private router: Router,
    private flashService: FlashMessagesService
  ) {
  }

  ngOnInit() {
    this.subscriptionRoute = this.route.paramMap.subscribe(params => {
      // fetch your new parameters here, on which you are switching the routes

      this.id = this.route.snapshot.paramMap.get('id');

      // Clear content of GalleryImg
      this.galleryImg = [];
      this.partnersArray = [];
      this.likesDisabled = false;

      this.subscriptionNews = this.realService
        .getNewsById(this.id)
        .valueChanges()
        .subscribe(real => {
          this.real = real;
          this.display = this.real.img.url;

          if (this.real.comments !== undefined) {
            this.real.comments.reverse();
          }

          // Get Associated Gallery Img
          if (this.real.galleryId !== undefined) {
            this.galleryImg = [];
            for (let i = 0; i < this.real.galleryId.length; i++) {
              this.subscriptionGal = this.galleryService
                .getPhotoInGallery(this.real.category, this.real.galleryId[i])
                .valueChanges()
                .subscribe(gallery => {
                  this.galleryImg.push(gallery);
                });
            }
          }

          // Get Associated Partners
          if (this.real.partnersId !== undefined) {
            for (let i = 0; i < this.real.partnersId.length; i++) {
              this.subscriptionPartner = this.parternService
                .getOnePartnerById(this.real.partnersId[i])
                .valueChanges()
                .subscribe(partner => {
                  this.partnersArray.push(partner);
                });
            }
          }
        });

      // Get Previous Realization
      this.subscriptionPrev = this.realService
        .getPreviousNewsById(this.id)
        .snapshotChanges()
        .pipe(
          map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
        )
        .subscribe(tempReal => {
          this.prevReal = tempReal[0] as Real;
          if (tempReal[0] !== undefined) {
            this.prevNewId = tempReal[0].key;
          }

          // Allow to know next there is no previous one [1] == undefined
          // this.prevReal = tempReal[1] as Real;
        });

      // Get Next Realization
      this.subscriptionNext = this.realService
        .getNextNewsById(this.id)
        .snapshotChanges()
        .pipe(
          map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
        )
        .subscribe(tempReal => {
          this.nextReal = tempReal[1] as Real;
          if (tempReal[1] !== undefined) {
            this.nextNewId = tempReal[1].key;
          }
        });
    });
  }

  liked() {
    if (!this.likesDisabled) {
      this.real.likes = this.real.likes + 1;
      this.partnersArray = [];
      this.realService.editRealLikes(this.id, this.real.likes);
      this.likesDisabled = true;
    }
  }

  changeDisplay(img) {
    this.display = img;
  }

  onSubmit() {
    if (this.comment.name !== '' && this.comment.mess !== '') {
      this.comment.date = new Date().toLocaleDateString('fr-FR', this.options);

      if (this.real.comments === undefined) {
        this.real.comments = new Array<any>();
      }

      this.real.comments.push(this.comment);

      this.partnersArray = [];
      this.realService.editRealComments(this.id, this.real.comments);

      // Show success message
      this.flashService.show('Message envoyé!', {
        cssClass: 'alert-success',
        timeout: 2000
      });
      this.comment.date = '';
      this.comment.name = '';
      this.comment.mess = '';
      this.router.navigate(['/real/' + this.id]);
    } else {
      // Show message error - Fill form fully
      this.flashService.show(
        'Erreur dans le formulaire, veuillez remplir les champs nécéssaires.',
        { cssClass: 'alert-danger', timeout: 2000 }
      );
    }
  }

  ngOnDestroy() {
    this.subscriptionRoute.unsubscribe();
    this.subscriptionNews.unsubscribe();

    if (this.subscriptionGal !== undefined) {
      this.subscriptionGal.unsubscribe();
    }

    if (this.subscriptionPartner !== undefined) {
      this.subscriptionPartner.unsubscribe();
    }

    if (this.subscriptionNext !== undefined) {
      this.subscriptionNext.unsubscribe();
    }
    if (this.subscriptionPrev !== undefined) {
      this.subscriptionPrev.unsubscribe();
    }
  }
}
