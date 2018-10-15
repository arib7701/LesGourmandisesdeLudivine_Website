import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../guards/auth.guard';
import { ActuEditComponent } from './actu-edit/actu-edit.component';
import { GalleryEditComponent } from './gallery-edit/gallery-edit.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RealEditComponent } from './real-edit/real-edit.component';
import { PartnerEditComponent } from './partner-edit/partner-edit.component';
import { ListDataComponent } from './list-data/list-data.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ListDataComponent },
      { path: 'gallery/edit/:cat', component: GalleryEditComponent },
      { path: 'recipes/edit/:id', component: RecipeEditComponent },
      { path: 'real/edit/:id', component: RealEditComponent },
      { path: 'partners/edit/:id', component: PartnerEditComponent },
      { path: 'actu/edit/:id', component: ActuEditComponent }
    ]
  }
];
