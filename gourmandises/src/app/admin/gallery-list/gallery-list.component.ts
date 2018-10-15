import { Component, OnInit, OnDestroy } from '@angular/core';
import { Gallery } from 'src/app/models/gallery';
import { Subscription } from 'rxjs';
import { GalleryService } from 'src/app/services/gallery.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css']
})
export class GalleryListComponent implements OnInit, OnDestroy {
  images: Gallery[];

  // Subscription
  subscriptionGal: Subscription;

  constructor(private galleryService: GalleryService) {
    this.subscriptionGal = this.galleryService
      .getAllGallery()
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
      )
      .subscribe(images => {
        this.images = [];
        images.forEach(element => {
          this.images.push(element as Gallery);
        });
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.subscriptionGal !== undefined) {
      this.subscriptionGal.unsubscribe();
    }
  }
}
