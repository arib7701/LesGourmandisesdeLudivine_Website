import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImgCat } from 'src/app/models/imgCategory';
import { Gallery } from 'src/app/models/gallery';
import { Subscription } from 'rxjs';
import { GalleryService } from 'src/app/services/gallery.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {
  categories: string[];
  imgByCategories: ImgCat[];
  imgPrinByCat: string[];
  imgs: Gallery[];
  subscriptionCat: Subscription;
  subscriptionGal: Subscription;

  constructor(
    private galleryService: GalleryService,
    private categoryService: CategoryService
  ) {
    this.imgByCategories = new Array<ImgCat>();
    this.imgPrinByCat = new Array<string>();
  }

  ngOnInit() {
    this.subscriptionCat = this.categoryService
      .getCategories()
      .valueChanges()
      .subscribe(categories => {
        this.categories = [];
        categories.forEach(element => {
          const el: string = element as any;
          this.categories.push(el);
        });

        const numberCat = this.categories.length;

        for (let i = 1; i < numberCat; i++) {
          this.subscriptionGal = this.galleryService
            .getOneGallery(this.categories[i])
            .valueChanges()
            .subscribe(imgs => {
              this.imgByCategories.push({
                cat: this.categories[i],
                imgs: imgs as Gallery[]
              });

              // Get Last Principale Imgs
              this.imgs = imgs as Gallery[];
              let k = this.imgs.length - 1;
              while (this.imgs[k].principale === false) {
                k--;
              }
              this.imgPrinByCat.push(this.imgs[k].img);
            });
        }
      });
  }

  ngOnDestroy() {
    this.subscriptionCat.unsubscribe();
    this.subscriptionGal.unsubscribe();
  }
}
