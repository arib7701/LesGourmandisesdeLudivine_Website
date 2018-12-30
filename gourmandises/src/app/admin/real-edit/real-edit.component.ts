import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Gallery } from 'src/app/models/gallery';
import { Partner } from 'src/app/models/partner';
import { RealService } from 'src/app/services/real.service';
import { PartnerService } from 'src/app/services/partner.service';
import { GalleryService } from 'src/app/services/gallery.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { map, finalize } from 'rxjs/operators';
import { Real } from 'src/app/models/real';
import { CategoryService } from 'src/app/services/category.service';
import { Ng2ImgToolsService } from 'ng2-img-tools';

@Component({
  selector: 'app-real-edit',
  templateUrl: './real-edit.component.html',
  styleUrls: ['./real-edit.component.css']
})
export class RealEditComponent implements OnInit, OnDestroy {
  options = { year: 'numeric', month: 'long', day: 'numeric' };

  id: string;
  categories: string[];
  category: string;

  // File Event
  primaryFile: File;
  galleryFiles: File[];
  downloadURL: Observable<string>;

  // Gallery Handler variables
  removeGal = [];
  storeIdImgRemoval: string[];
  galleryFilesLength: Number = 0;
  photo: Gallery;
  galleryImg = new Array<Gallery>();

  // Partners Handler variables
  partner: Partner;
  partnersArray = new Array<Partner>();
  partnersArrayOld = new Array<Partner>();
  storeIdPartnersRemoval: string[];
  oldPartner: Partner;

  real: Real;
  gallery: Gallery;

  // Subscriptions
  subscriptionRoute: Subscription;
  subscriptionCat: Subscription;
  subscriptionNews: Subscription;
  subscriptionGal: Subscription;
  subscriptionPartner: Subscription;
  subscriptionStorage: Subscription;
  subscriptionStorage2: Subscription;

  constructor(
    private categoryService: CategoryService,
    private realService: RealService,
    private partnerService: PartnerService,
    private galleryService: GalleryService,
    private flashService: FlashMessagesService,
    private router: Router,
    private route: ActivatedRoute,
    private imgToolsService: Ng2ImgToolsService,
    private storageService: AngularFireStorage
  ) {
    this.subscriptionRoute = this.route.paramMap.subscribe(params => {
      // fetch your new parameters here, on which you are switching the routes

      this.real = new Real();
      this.gallery = new Gallery();
      this.storeIdPartnersRemoval = new Array<string>();
      this.galleryFiles = new Array<File>();

      // Clear content of GalleryImg and PartnersArray
      this.galleryImg = new Array<Gallery>();
      this.partnersArray = new Array<Partner>();

      this.id = this.route.snapshot.params['id'];
      this.subscriptionCat = this.categoryService
        .getCategories()
        .valueChanges()
        .subscribe(categories => {
          this.categories = [];
          categories.forEach(element => {
            const el: string = element as any;
            this.categories.push(el);
          });
        });

      this.subscriptionNews = this.realService
        .getNewsById(this.id)
        .valueChanges()
        .subscribe(real => {
          this.real = real;
          this.category = this.real.category;

          if (this.real.galleryId !== undefined) {
            // Get Associated Gallery Img
            for (let i = 0; i < this.real.galleryId.length; i++) {
              this.subscriptionGal = this.galleryService
                .getPhotoInGallery(this.real.category, this.real.galleryId[i])
                .valueChanges()
                .subscribe(photo => {
                  this.photo = photo;
                  this.galleryImg[i] = this.photo;
                });
            }
          }

          if (this.real.partnersId !== undefined) {
            // Get Associated Partners Objects
            for (let i = 0; i < this.real.partnersId.length; i++) {
              this.subscriptionPartner = this.partnerService
                .getOnePartnerById(this.real.partnersId[i])
                .valueChanges()
                .subscribe(partner => {
                  this.partner = partner;
                  this.partnersArray[i] = this.partner;
                  this.partnersArrayOld[i] = this.partner;
                });
            }
          }
        });
    });
  }

  ngOnInit() {}

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  uploadPrim(event) {
    this.primaryFile = event.target.files[0];
  }

  uploadGal(event) {
    this.galleryFiles = event.target.files;
    this.galleryFilesLength = this.galleryFiles.length;
  }

  getOldPartner(event, i: number) {
    this.partnerService
      .getOnePartnerByName(this.partnersArray[i].name)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() })))
      )
      .subscribe(old => {
        this.oldPartner = old as Partner;
      });
  }

  addPartner() {
    this.partnersArray.push({
      name: '',
      website: '',
      logo: '',
      location: '',
      isPartner: false,
      realDate: [this.real.date],
      realTitle: [this.real.title],
      realId: [this.id],
      alreadyUsed: false
    });
  }

  deletePartner(number: number) {
    if (
      confirm('Etes-vous sure de vouloir supprimer ce partenaire / produit?')
    ) {
      this.storeIdPartnersRemoval.push(this.real.partnersId[number]);
      this.real.partnersId.splice(number, 1);
      this.partnersArray.splice(number, 1);
    }
  }

  updateOldPartner(oldPartner: Partner) {
    if (oldPartner.realId !== undefined) {
      oldPartner.realId.push(this.id);
      oldPartner.realTitle.push(this.real.title);
      oldPartner.realDate.push(
        new Date().toLocaleDateString('fr-FR', this.options)
      );

      // Update Partner with added new Real Info
      this.partnerService.editPartner(oldPartner.key, oldPartner as Partner[]);

      // If Partner Empty in Real, initialize value
      if (this.real.partnersId === undefined) {
        this.real.partnersId = new Array<string>();
      }

      // Add ID of Partner to Realization
      this.real.partnersId.push(oldPartner.key);
    }
  }

  onDeleteCom(number: number) {
    if (confirm('Etes-vous sure de vouloir supprimer ce commentaire?')) {
      this.real.comments.splice(number, 1);
    }
  }

  onDeleteGal(number: number) {
    if (confirm('Etes-vous sure de vouloir supprimer cette image?')) {
      // Store ID of Img to remove
      this.storeIdImgRemoval.push(this.real.galleryId[number]);

      // Save Url and ID to Delete In DB onSubmit
      this.removeGal.push(this.galleryImg[number].img);

      // Remove Img in Realization Gallery Id
      this.real.galleryId.splice(number, 1);
      this.galleryImg.splice(number, 1);
    }
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

  deleteImgDatabase(id: string, category: string) {
    // Remove from Gallery DB
    this.galleryService.deletePhotoInGallery(category, id);
  }

  comparePartners(oldP: Partner[], updatedP: Partner[]): Partner[] {
    oldP.forEach(item2 => {
      updatedP = updatedP.filter(item1 => {
        return item1 !== item2;
      });
    });
    return updatedP;
  }

  onSubmit() {
    if (this.real.title !== '' && this.real.description !== '') {
      // Compare oldPartners and updatedPartners to only keep new Ones
      let partnersToAdd = new Array<Partner>();
      partnersToAdd = this.comparePartners(
        this.partnersArrayOld,
        this.partnersArray
      );

      // Remove delete Partners from DB
      if (this.storeIdPartnersRemoval.length > 0) {
        for (let i = 0; i < this.storeIdPartnersRemoval.length; i++) {
          this.partnerService.deletePartner(this.storeIdPartnersRemoval[i]);
        }
      }

      // Edit Updated & Add New Partners to DB and add ID to associated realization
      for (let k = 0; k < this.partnersArray.length; k++) {
        // If Partners NOT in ToAdd => edit it
        if (partnersToAdd.indexOf(this.partnersArray[k]) === -1) {
          this.partnerService.editPartner(this.real.partnersId[k], this
            .partnersArray[k] as Partner[]);

          // if IN ToAdd => create New One or Update if previously used
        } else {
          // If Not alreayd used, create brand new
          if (this.partnersArray[k].alreadyUsed !== true) {
            const newPartnerId = this.partnerService.createNewPartner(this
              .partnersArray[k] as Partner[]);

            // If Partner Empty in Real, initialize value
            if (this.real.partnersId === undefined) {
              this.real.partnersId = new Array<any>();
            }

            this.real.partnersId.push(newPartnerId);

            // If Already used, update Partner
          } else {
            this.updateOldPartner(this.oldPartner[0]);
          }
        }

        // Update Associated Realization
        this.realService.editReal(this.id, this.real as Real[]);
      }

      // If picture principale was changed
      if (this.primaryFile !== undefined) {
        if (this.real.img.url !== '' || this.real.img.id !== '') {
          this.deleteImgStorage(this.real.img.url);
          this.deleteImgDatabase(this.real.img.id, this.real.category);
        }

        const id: string = Math.random()
          .toString(36)
          .substring(2);

        // Add to Fire Storage
        const filePath = id;
        const fileRef = this.storageService.ref(filePath);
        const task = this.storageService.upload(filePath, this.primaryFile);

        // Get Url and Save to DB
        this.subscriptionStorage = task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.downloadURL = fileRef.getDownloadURL();
              this.downloadURL.subscribe(url => {
                this.real.img.url = url;

                this.gallery.img = url;
                this.gallery.principale = true;
                this.gallery.date = new Date().toLocaleDateString(
                  'fr-FR',
                  this.options
                );
                this.gallery.newsLink = this.id;
                const key = this.galleryService.addToGallery(
                  this.gallery as Gallery[],
                  this.category
                );
                this.real.img.id = key;
                this.realService.editReal(this.id, this.real as Real[]);
              });
            })
          )
          .subscribe();
      }

      // If imgs removed of Gallery
      if (this.removeGal.length > 0 && this.storeIdImgRemoval.length > 0) {
        for (let i = 0; i < this.removeGal.length; i++) {
          // Delete from Storage using URL
          this.deleteImgStorage(this.removeGal[i]);

          // Delete from Gallery DB using Img ID
          this.deleteImgDatabase(this.storeIdImgRemoval[i], this.real.category);
        }
        // Remove Img from Realization in DB
        this.realService.editReal(this.id, this.real as Real[]);
      }

      // If new imgs added to Gallery
      if (this.galleryFiles.length > 0) {
        for (let i = 0; i < this.galleryFilesLength; i++) {
          // Get current File
          const currentFile = this.galleryFiles[i];

          // Create Unique random ID for Storage
          const id: string = Math.random()
            .toString(36)
            .substring(2);

          // Add to Fire Storage
          const filePath = id;
          const fileRef = this.storageService.ref(filePath);
          const task = this.storageService.upload(filePath, currentFile);

          // Get Url from Storage and Save to DB
          this.subscriptionStorage = task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                this.downloadURL = fileRef.getDownloadURL();
                this.downloadURL.subscribe(url => {
                  this.gallery.img = url;
                  this.gallery.date = new Date().toLocaleDateString(
                    'fr-FR',
                    this.options
                  );
                  this.gallery.principale = false;
                  this.gallery.newsLink = this.id;
                  const key = this.galleryService.addToGallery(
                    this.gallery as Gallery[],
                    this.category
                  );

                  // If Gallery Empty, initialize value
                  if (this.real.galleryId === undefined) {
                    this.real.galleryId = new Array<string>();
                  }

                  // Add ID of Img to Realization in Array
                  this.real.galleryId.push(key);
                  this.realService.editReal(this.id, this.real as Real[]);

                  // Store Resized Image Url to DB Gallery
                  this.storeResizedImgToDB(id, key, currentFile);
                });
              })
            )
            .subscribe();
        }
      }

      // If no change of picture at all
      if (this.primaryFile === undefined && this.galleryFiles.length === 0) {
        this.realService.editReal(this.id, this.real as Real[]);
      }
      // this.router.navigate(['/real/' + this.id]);
    } else {
      // Show message error - Fill form fully
      this.flashService.show(
        'Erreur dans le formulaire, veuillez remplir les champs nécéssaires.',
        { cssClass: 'alert-danger', timeout: 2000 }
      );
      this.router.navigate(['/real/edit/' + this.id]);
    }
  }

  storeResizedImgToDB(idFile: string, idGallery: string, currentFile: File) {

    // Resize to 300x300 for Random Gallery on Home Page
    let file300: Blob;

    this.imgToolsService
    .resizeExactCropImage(currentFile, 300, 300)
    .subscribe( result => {

      file300 = result;

      const filePath300 = `${idFile}_300`;
      const fileRef300 = this.storageService.ref(filePath300);
      const task300 = this.storageService.upload(filePath300, file300);

      this.getUrlResizedImg(fileRef300, task300, idGallery);
    },
    error => {
      console.log('Error resizing image');
    });
  }

  getUrlResizedImg(fileRef: AngularFireStorageReference, task: AngularFireUploadTask, idGallery: string) {

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
              this.updateGalleryWithResizedImg(idGallery, urlStored);
            },
            error => {
              console.log('Error resizing image');
            });
          })
        )
        .subscribe();
  }

  updateGalleryWithResizedImg(idGallery: string, urlStored: string) {

    this.gallery.img300 = urlStored;
    this.galleryService.editGallery(
      idGallery,
      this.gallery as Gallery[],
      this.real.category
    );
  }

  ngOnDestroy() {
    if (this.subscriptionRoute !== undefined) {
      this.subscriptionRoute.unsubscribe();
    }

    if (this.subscriptionCat !== undefined) {
      this.subscriptionCat.unsubscribe();
    }

    if (this.subscriptionNews !== undefined) {
      this.subscriptionNews.unsubscribe();
    }

    if (this.subscriptionGal !== undefined) {
      this.subscriptionGal.unsubscribe();
    }

    if (this.subscriptionPartner !== undefined) {
      this.subscriptionPartner.unsubscribe();
    }

    if (this.subscriptionStorage !== undefined) {
      this.subscriptionStorage.unsubscribe();
    }
    if (this.subscriptionStorage2 !== undefined) {
      this.subscriptionStorage2.unsubscribe();
    }
  }
}
