import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { AngularFireStorageModule } from 'angularfire2/storage';

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
    RouterModule
  ],
  declarations: [NavbarComponent, FooterComponent],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AngularFireModule,
    AngularFireStorageModule,
    FlashMessagesModule,
    OwlModule,
    NavbarComponent,
    FooterComponent
  ],
  providers: [
    AngularFireAuth,
    AngularFireDatabase,
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
