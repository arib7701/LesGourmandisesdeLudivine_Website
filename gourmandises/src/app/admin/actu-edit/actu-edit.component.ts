import { Component, OnInit, OnDestroy } from '@angular/core';
import { Actu } from 'src/app/models/actu';
import { Subscription, Observable } from 'rxjs';
import { ActuService } from 'src/app/services/actu.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import * as moment from 'moment';

@Component({
  selector: 'app-actu-edit',
  templateUrl: './actu-edit.component.html',
  styleUrls: ['./actu-edit.component.css']
})
export class ActuEditComponent implements OnInit, OnDestroy {
  options = { year: 'numeric', month: 'long', day: 'numeric' };
  id: string;
  actu: Actu;
  subscriptionActu: Subscription;
  subscriptionStorage: Subscription;
  subscriptionStorage2: Subscription;
  imgFile: File;
  pickedDate: Date;
  downloadURL: Observable<string>;

  constructor(
    private actuService: ActuService,
    private flashService: FlashMessagesService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: AngularFireStorage,
    private imgToolsService: Ng2ImgToolsService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.actu = new Actu();

    this.subscriptionActu = this.actuService
      .getOneActuById(this.id)
      .valueChanges()
      .subscribe(actu => {
        this.actu = actu;
        moment.locale('fr');
        this.pickedDate = moment(this.actu.date, 'DD MMMM YYYY').toDate();
      });
  }

  ngOnInit() {}

  uploadImg(event) {
    this.imgFile = event.target.files[0];
  }

  // Delete Picture From Storage
  deleteImgStorage(img: string) {
    if (img !== undefined) {
      this.storageService
        .refFromURL(img)
        .delete()
        .toPromise()
        .then(() => {})
        .catch(err => {
          console.log('Error removing old picture');
        });
    }
  }

  onSubmit() {
    // If picture was changed
    if (this.imgFile !== undefined) {
      if (this.actu.img !== '') {
        this.deleteImgStorage(this.actu.img);
        this.deleteImgStorage(this.actu.img160);
        this.deleteImgStorage(this.actu.img400);
      }

      const id: string = Math.random()
        .toString(36)
        .substring(2);

      // Add to Fire Storage
      const filePath: string = id;
      const fileRef: AngularFireStorageReference = this.storageService.ref(
        filePath
      );
      const task: AngularFireUploadTask = this.storageService.upload(
        filePath,
        this.imgFile
      );

      // Get Url and Save to DB
      this.subscriptionStorage = task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              this.actu.img = url;
              this.actu.date = this.pickedDate.toLocaleDateString(
                'fr-FR',
                this.options
              );
              this.actuService.editActu(this.id, this.actu as Actu[]);

              // Store Resized Image Url to DB Gallery
              this.storeResizedImgToDB(id, this.id);
            });
          })
        )
        .subscribe();
    } else {
      this.actu.date = this.pickedDate.toLocaleDateString(
        'fr-FR',
        this.options
      );
      this.actuService.editActu(this.id, this.actu as Actu[]);
    }

    this.flashService.show('Changements sauvegardés!', {
      cssClass: 'alert-success',
      timeout: 2000
    });
    this.router.navigate(['/admin/actu/edit/' + this.id]);
  }

  storeResizedImgToDB(idFile: string, idActu: string) {
    // Resize to 400x400 for Actu Home Page
    let file400: Blob;

    this.imgToolsService.resizeImage(this.imgFile, 400, 400).subscribe(
      result => {
        file400 = result;

        const filePath400 = `${idFile}_400`;
        const fileRef400 = this.storageService.ref(filePath400);
        const task400 = this.storageService.upload(filePath400, file400);

        this.getUrlResizedImg(fileRef400, task400, idActu, 400);
      },
      error => {
        console.log('Error resizing image');
      }
    );

    // Resize to 160x160 for Archive Actu Page
    let file160: Blob;

    this.imgToolsService.resizeExactCropImage(this.imgFile, 160, 160).subscribe(
      result => {
        file160 = result;

        const filePath160 = `${idFile}_160`;
        const fileRef160 = this.storageService.ref(filePath160);
        const task160 = this.storageService.upload(filePath160, file160);

        this.getUrlResizedImg(fileRef160, task160, idActu, 160);
      },
      error => {
        console.log('Error resizing image');
      }
    );
  }

  getUrlResizedImg(
    fileRef: AngularFireStorageReference,
    task: AngularFireUploadTask,
    idActu: string,
    size: number
  ) {
    let downloadedURL: Observable<string>;
    let urlStored: string;

    this.subscriptionStorage2 = task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          downloadedURL = fileRef.getDownloadURL();
          downloadedURL.subscribe(
            urlStorage => {
              // Set up value of New Realization
              urlStored = urlStorage;
              this.updateGalleryWithResizedImg(idActu, urlStored, size);
            },
            error => {
              console.log('Error resizing image');
            }
          );
        })
      )
      .subscribe();
  }

  updateGalleryWithResizedImg(idActu: string, urlStored: string, size: number) {
    if (size === 400) {
      this.actu.img400 = urlStored;
    }
    if (size === 160) {
      this.actu.img160 = urlStored;
    }

    this.actu.date = this.pickedDate.toLocaleDateString('fr-FR', this.options);
    this.actuService.editActu(idActu, this.actu as Actu[]);
  }

  ngOnDestroy() {
    if (this.subscriptionActu) {
      this.subscriptionActu.unsubscribe();
    }

    if (this.subscriptionStorage) {
      this.subscriptionStorage.unsubscribe();
    }
    if (this.subscriptionStorage2) {
      this.subscriptionStorage2.unsubscribe();
    }
  }
}
