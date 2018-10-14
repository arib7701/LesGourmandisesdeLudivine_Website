import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryDetailComponent } from './gallery-detail/gallery-detail.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { ArchivesRealComponent } from './archives-real/archives-real.component';
import { ArchivesActuComponent } from './archives-actu/archives-actu.component';
import { ContactComponent } from './contact/contact.component';
import { PartnersComponent } from './partners/partners.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { BuyComponent } from './buy/buy.component';
import { RealDetailComponent } from './real-detail/real-detail.component';
import { RouterModule } from '@angular/router';
import { mainRoutes } from './main.routes';
import { RealComponent } from './real/real.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild(mainRoutes)],
  declarations: [
    MainComponent,
    HomeComponent,
    GalleryComponent,
    GalleryDetailComponent,
    RecipesComponent,
    RecipeDetailComponent,
    ArchivesRealComponent,
    ArchivesActuComponent,
    ContactComponent,
    PartnersComponent,
    AboutComponent,
    LoginComponent,
    BuyComponent,
    RealDetailComponent,
    RealComponent
  ]
})
export class MainModule {}
