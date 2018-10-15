import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../../environments/environment';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularFireStorage } from 'angularfire2/storage';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterTestingModule,
    HttpClientTestingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FlashMessagesModule.forRoot(),
    NgxPaginationModule
  ],
  declarations: [],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [AngularFireStorage],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    RouterTestingModule,
    HttpClientTestingModule,
    AngularFireModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FlashMessagesModule,
    NgxPaginationModule
  ]
})
export class TestsModule {}
