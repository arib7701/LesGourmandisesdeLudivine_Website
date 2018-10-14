import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { ActuEditComponent } from './actu-edit/actu-edit.component';
import { GalleryEditComponent } from './gallery-edit/gallery-edit.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RealEditComponent } from './real-edit/real-edit.component';
import { PartnerEditComponent } from './partner-edit/partner-edit.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    AdminComponent,
    ActuEditComponent,
    GalleryEditComponent,
    RecipeEditComponent,
    RealEditComponent,
    PartnerEditComponent
  ]
})
export class AdminModule {}
