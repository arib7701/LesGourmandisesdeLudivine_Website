import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { ArchivesActuComponent } from './archives-actu/archives-actu.component';
import { ContactComponent } from './contact/contact.component';
import { PartnersComponent } from './partners/partners.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { BuyComponent } from './buy/buy.component';
import { ArchivesRealComponent } from './archives-real/archives-real.component';
import { GalleryDetailComponent } from './gallery-detail/gallery-detail.component';
import { RealDetailComponent } from './real-detail/real-detail.component';

export const adminRoutes: Routes = [
  {
    path: 'home',
    component: MainComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'gallery', component: GalleryComponent },
      { path: 'gallery/:cat', component: GalleryDetailComponent },
      { path: 'recipes', component: RecipesComponent },
      { path: 'recipes/:id', component: RecipeDetailComponent },
      { path: 'real/:id', component: RealDetailComponent },
      { path: 'archivesReal', component: ArchivesRealComponent },
      { path: 'archivesActu', component: ArchivesActuComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'partners', component: PartnersComponent },
      { path: 'about', component: AboutComponent },
      { path: 'login', component: LoginComponent },
      { path: 'buy', component: BuyComponent }
    ]
  }
];
