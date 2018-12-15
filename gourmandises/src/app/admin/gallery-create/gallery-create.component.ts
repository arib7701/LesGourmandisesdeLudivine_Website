import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  Input
} from '@angular/core';
import { Real } from 'src/app/models/real';
import { Gallery } from 'src/app/models/gallery';
import { Observable, Subscription } from 'rxjs';
import { GalleryService } from 'src/app/services/gallery.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { RealService } from 'src/app/services/real.service';

@Component({
  selector: 'app-gallery-create',
  templateUrl: './gallery-create.component.html',
  styleUrls: ['./gallery-create.component.css']
})
export class GalleryCreateComponent implements OnInit, OnDestroy {
  @Input()
  real: Real;

  @Output()
  change: EventEmitter<string> = new EventEmitter();

  options = { year: 'numeric', month: 'long', day: 'numeric' };

  newGal: Gallery;

  // Upload Files variables
  galleryFiles;
  galleryFilesLength;
  downloadURL: Observable<string>;

  // Subscription
  subscriptionStorage: Subscription;
  subscriptionStorageGal: Subscription;
  subscriptionURL: Subscription;

  constructor(
    private galleryService: GalleryService,
    private realService: RealService,
    private storage: AngularFireStorage
  ) {
    this.newGal = new Gallery();
  }

  ngOnInit() {}

  uploadGal(event) {
    this.galleryFiles = new Array<File>();
    this.galleryFilesLength = 0;
    this.galleryFiles = event.target.files;
    this.galleryFilesLength = this.galleryFiles.length;
  }

  // ------  SAVE GALLERY IMGS TO DATABASE --------
  onSubmitGallery() {
    if (this.galleryFiles.length > 0) {
      // Loop through each File
      for (let i = 0; i < this.galleryFilesLength; i++) {
        const currentFile = this.galleryFiles[i];
        const id: string = Math.random()
          .toString(36)
          .substring(2);

        // Add to Fire Storage
        const filePath = id;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, currentFile);

        // Get Url and Save to DB
        this.subscriptionStorageGal = task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.downloadURL = fileRef.getDownloadURL();
              this.subscriptionURL = this.downloadURL.subscribe(url => {
                this.newGal.img = url;
                this.newGal.date = new Date().toLocaleDateString(
                  'fr-FR',
                  this.options
                );
                this.newGal.principale = false;
                this.newGal.newsLink = this.real.key;
                const key = this.galleryService.addToGallery(
                  this.newGal as Gallery[],
                  this.real.category
                );

                // Add ID of Img to Realization
                if (this.real.galleryId === undefined) {
                  this.real.galleryId = new Array<string>();
                }
                this.real.galleryId.push(key);
                this.realService.editReal(this.real.key, this.real as Real[]);

                if (i === this.galleryFilesLength - 1) {
                  this.change.emit('recipe');
                }
              });
            })
          )
          .subscribe();
      }
      // Show success message
      /*this.flashMess.show('Images sauvegardées!', {
        cssClass: 'alert-success',
        timeout: 2000
      });*/
    }
  }

  ngOnDestroy() {
    if (this.subscriptionStorage !== undefined) {
      this.subscriptionStorage.unsubscribe();
    }
    if (this.subscriptionStorageGal !== undefined) {
      this.subscriptionStorageGal.unsubscribe();
    }
    if (this.subscriptionURL !== undefined) {
      this.subscriptionURL.unsubscribe();
    }
  }

  noGallery() {
    this.change.emit('recipe');
  }
}
