import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GalleryService } from 'src/app/services/gallery.service';
import { ActivatedRoute } from '@angular/router';
import { Gallery } from 'src/app/models/gallery';

@Component({
  selector: 'app-gallery-detail',
  templateUrl: './gallery-detail.component.html',
  styleUrls: ['./gallery-detail.component.css']
})
export class GalleryDetailComponent implements OnInit, OnDestroy {
  category: string;
  imgs: Gallery[];
  subscriptionGal: Subscription;

  constructor(
    private galleryService: GalleryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.category = this.route.snapshot.params['cat'];

    this.subscriptionGal = this.galleryService
      .getOneGallery(this.category)
      .valueChanges()
      .subscribe(imgs => {
        this.imgs = [];
        imgs.forEach(element => {
          this.imgs.push(element as Gallery);
        });
        this.imgs.reverse();
      });
  }

  ngOnDestroy() {
    this.subscriptionGal.unsubscribe();
  }
}
