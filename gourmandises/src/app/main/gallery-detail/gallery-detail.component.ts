import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GalleryService } from 'src/app/services/gallery.service';
import { ActivatedRoute } from '@angular/router';
import { Gallery } from 'src/app/models/gallery';
import * as moment from 'moment';

@Component({
  selector: 'app-gallery-detail',
  templateUrl: './gallery-detail.component.html',
  styleUrls: ['./gallery-detail.component.css']
})

// TO DO
// check css to avoid weird placement
export class GalleryDetailComponent implements OnInit, OnDestroy {
  category: string;
  imgs: Gallery[];
  subscriptionGal: Subscription;

  constructor(
    private galleryService: GalleryService,
    private route: ActivatedRoute
  ) {
    this.category = this.route.snapshot.params['cat'];

    this.subscriptionGal = this.galleryService
      .getOneGallery(this.category)
      .valueChanges()
      .subscribe(imgs => {
        this.imgs = [];
        imgs.forEach(element => {
          this.imgs.push(element as Gallery);
        });
        this.imgs.sort(this.sortByDate);
      });
  }

  sortByDate(a: Gallery, b: Gallery): number {
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
    this.subscriptionGal.unsubscribe();
  }
}
