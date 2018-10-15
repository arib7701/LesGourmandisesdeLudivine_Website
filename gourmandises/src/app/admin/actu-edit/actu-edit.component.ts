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

@Component({
  selector: 'app-actu-edit',
  templateUrl: './actu-edit.component.html',
  styleUrls: ['./actu-edit.component.css']
})
export class ActuEditComponent implements OnInit, OnDestroy {
  id: string;
  actu: Actu;
  subscriptionActu: Subscription;
  subscriptionStorage: Subscription;
  imgFile: File;
  downloadURL: Observable<string>;

  constructor(
    private actuService: ActuService,
    private flashService: FlashMessagesService,
    private router: Router,
    private route: ActivatedRoute,
    private storage: AngularFireStorage
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    this.actu = new Actu();

    this.subscriptionActu = this.actuService
      .getOneActuById(this.id)
      .valueChanges()
      .subscribe(actu => {
        this.actu = actu;
      });
  }

  ngOnInit() {}

  uploadImg(event) {
    this.imgFile = event.target.files[0];
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

  onSubmit() {
    // If picture was changed
    if (this.imgFile !== undefined) {
      if (this.actu.img !== '') {
        this.deleteImgStorage(this.actu.img);
      }

      const id: string = Math.random()
        .toString(36)
        .substring(2);

      // Add to Fire Storage
      const filePath: string = id;
      const fileRef: AngularFireStorageReference = this.storage.ref(filePath);
      const task: AngularFireUploadTask = this.storage.upload(
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
              this.actuService.editActu(this.id, this.actu as Actu[]);
            });
          })
        )
        .subscribe();
    } else {
      this.actuService.editActu(this.id, this.actu as Actu[]);
    }

    this.flashService.show('Changements sauvegardés!', {
      cssClass: 'alert-success',
      timeout: 2000
    });
    this.router.navigate(['/admin/actu/edit/' + this.id]);
  }

  ngOnDestroy() {
    if (this.subscriptionActu) {
      this.subscriptionActu.unsubscribe();
    }

    if (this.subscriptionStorage) {
      this.subscriptionStorage.unsubscribe();
    }
  }
}
