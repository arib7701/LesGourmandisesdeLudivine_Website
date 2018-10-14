import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Main Components
import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';

// Gallery Components
import { GalleryHomeComponent } from './gallery-home/gallery-home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryDetailComponent } from './gallery-detail/gallery-detail.component';

// Recipes Components
import { RecipeHomeComponent } from './recipe-home/recipe-home.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';

// Actus Components
import { ActuHomeComponent } from './actu-home/actu-home.component';
import { ArchivesActuComponent } from './archives-actu/archives-actu.component';

// Others Components
import { ContactComponent } from './contact/contact.component';
import { PartnersComponent } from './partners/partners.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';

// Buy Components
import { BuyComponent } from './buy/buy.component';
import { BuyHomeComponent } from './buy-home/buy-home.component';

// Real Components
import { RealComponent } from './real/real.component';
import { RealDetailComponent } from './real-detail/real-detail.component';
import { ArchivesRealComponent } from './archives-real/archives-real.component';

// Routes
import { mainRoutes } from './main.routes';

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
    RealComponent,
    HeaderComponent,
    BuyHomeComponent,
    GalleryHomeComponent,
    RecipeHomeComponent,
    ActuHomeComponent
  ]
})
export class MainModule {}
