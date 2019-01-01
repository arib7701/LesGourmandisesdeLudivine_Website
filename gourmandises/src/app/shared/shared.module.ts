import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Ng2ImgToolsModule } from 'ng2-img-tools';
import { MatButtonModule, MatInputModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';

// Third Party
import { FlashMessagesModule } from 'angular2-flash-messages';
import { OwlModule } from 'ngx-owl-carousel';
import { AutosizeModule } from 'ngx-autosize';
import { NgxPaginationModule } from 'ngx-pagination';

// Firebase Config
import { environment } from '../../environments/environment';

// Import Angular Modules
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFireStorageModule,
  AngularFireStorage
} from 'angularfire2/storage';

// Import Services / Guards
import { ActuService } from '../services/actu.service';
import { RealService } from '../services/real.service';
import { GalleryService } from '../services/gallery.service';
import { RecipeService } from '../services/recipe.service';
import { PartnerService } from '../services/partner.service';
import { CategoryService } from '../services/category.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { FormErrorsComponent } from './form-errors/form-errors.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    FlashMessagesModule.forRoot(),
    OwlModule,
    RouterModule,
    AutosizeModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LazyLoadImageModule,
    Ng2ImgToolsModule
  ],
  declarations: [NavbarComponent, FooterComponent, FormErrorsComponent],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AngularFireModule,
    AngularFireStorageModule,
    FlashMessagesModule,
    OwlModule,
    NavbarComponent,
    FooterComponent,
    FormErrorsComponent,
    AutosizeModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LazyLoadImageModule,
    Ng2ImgToolsModule
  ],
  providers: [
    AngularFireAuth,
    AngularFireDatabase,
    AngularFireStorage,
    ActuService,
    RealService,
    RecipeService,
    GalleryService,
    CategoryService,
    PartnerService,
    AuthService,
    AuthGuard
  ]
})
export class SharedModule {}
