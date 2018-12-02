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
import { ListDataComponent } from './list-data/list-data.component';
import { ListDataSubComponent } from './list-data-sub/list-data-sub.component';
import { RealCreateComponent } from './real-create/real-create.component';
import { RecipeCreateComponent } from './recipe-create/recipe-create.component';
import { PartnerCreateComponent } from './partner-create/partner-create.component';
import { GalleryCreateComponent } from './gallery-create/gallery-create.component';
import { ActuCreateComponent } from './actu-create/actu-create.component';
import { CreateDataComponent } from './create-data/create-data.component';
import { OrderEditComponent } from './order-edit/order-edit.component';

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild(adminRoutes)],
  declarations: [
    AdminComponent,
    ActuEditComponent,
    GalleryEditComponent,
    RecipeEditComponent,
    RealEditComponent,
    PartnerEditComponent,
    ListDataComponent,
    ListDataSubComponent,
    RealCreateComponent,
    RecipeCreateComponent,
    PartnerCreateComponent,
    GalleryCreateComponent,
    ActuCreateComponent,
    CreateDataComponent,
    OrderEditComponent
  ]
})
export class AdminModule {}
