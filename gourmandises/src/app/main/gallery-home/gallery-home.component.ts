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
  ) {}

  ngOnInit() {
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

              if (i === categories.length - 1) {
                this.randomGal = this.randomGal.slice(0, 20);
              }
            });
        }
      });

    /*this.subscriptionGal = this.galleryService
      .getTwentyRandomImg()
      .valueChanges()
      .subscribe(galleries => {
        this.randomGal = [];
        galleries.forEach(element => {
          this.randomGal.push(element as Gallery);
        });
        this.randomGal = this.shuffle(this.randomGal);
      });*/
  }

  randomPick(array) {
    let len = array.length;
    console.log(len);
    const result = new Array(10);
    const taken = new Array(len);
    if (10 > len) {
      throw new RangeError('getRandom: more elements taken than available');
    }
    let i = 10;
    while (i--) {
      const x = Math.floor(Math.random() * len);
      result[i] = array[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    this.randomGal = [];
    return result;
  }

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
