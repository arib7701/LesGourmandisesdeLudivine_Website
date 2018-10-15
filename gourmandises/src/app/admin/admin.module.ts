import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { ActuEditComponent } from './actu-edit/actu-edit.component';
import { GalleryEditComponent } from './gallery-edit/gallery-edit.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RealEditComponent } from './real-edit/real-edit.component';
import { PartnerEditComponent } from './partner-edit/partner-edit.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin.routes';
import { ActuListComponent } from './actu-list/actu-list.component';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import { PartnerListComponent } from './partner-list/partner-list.component';
import { RealListComponent } from './real-list/real-list.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { ListDataComponent } from './list-data/list-data.component';

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild(adminRoutes)],
  declarations: [
    AdminComponent,
    ActuEditComponent,
    GalleryEditComponent,
    RecipeEditComponent,
    RealEditComponent,
    PartnerEditComponent,
    ActuListComponent,
    GalleryListComponent,
    PartnerListComponent,
    RealListComponent,
    RecipeListComponent,
    ListDataComponent
  ]
})
export class AdminModule {}
