import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterTestingModule,
    HttpClientTestingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  declarations: [],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    RouterTestingModule,
    HttpClientTestingModule,
    AngularFireModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ]
})
export class TestsModule {}
