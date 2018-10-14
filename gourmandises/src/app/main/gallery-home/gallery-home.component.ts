import { Component, OnInit, OnDestroy } from '@angular/core';
import { Gallery } from 'src/app/models/gallery';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { GalleryService } from 'src/app/services/gallery.service';

@Component({
  selector: 'app-gallery-home',
  templateUrl: './gallery-home.component.html',
  styleUrls: ['./gallery-home.component.css']
})
export class GalleryHomeComponent implements OnInit, OnDestroy {
  randomGal: Gallery[];
  categories: string[];
  oneGal: Gallery[];
  subscriptionCat: Subscription;
  subscriptionGal: Subscription;

  constructor(
    private galleryService: GalleryService,
    private categoryService: CategoryService
  ) {
    this.randomGal = [];

    this.subscriptionCat = this.categoryService
      .getCategories()
      .valueChanges()
      .subscribe(categories => {
        this.categories = [];
        categories.forEach(element => {
          const el: string = element as any;
          this.categories.push(el);
        });

        for (let i = 0; i < this.categories.length; i++) {
          this.subscriptionGal = this.galleryService
            .getOneGallery(this.categories[i])
            .valueChanges()
            .subscribe(oneGal => {
              this.oneGal = oneGal as Gallery[];

              for (let j = 0; j < this.oneGal.length; j++) {
                this.randomGal.push(this.oneGal[j]);
              }
              this.randomGal = this.shuffle(this.randomGal);
            });
        }
      });
  }

  ngOnInit() {}

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  ngOnDestroy() {
    if (this.subscriptionCat !== undefined) {
      this.subscriptionCat.unsubscribe();
    }

    if (this.subscriptionGal !== undefined) {
      this.subscriptionGal.unsubscribe();
    }
  }
}
