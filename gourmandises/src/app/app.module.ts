import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Firebase Credentials
export const firebaseConfig = {
  apiKey: 'AIzaSyBJtDdfGIudny6c9DFwDEzMm5lCJiQiAxM',
  authDomain: 'lesgourmandisesdeludivine.firebaseapp.com',
  databaseURL: 'https://lesgourmandisesdeludivine.firebaseio.com',
  projectId: 'lesgourmandisesdeludivine',
  storageBucket: 'lesgourmandisesdeludivine.appspot.com',
  messagingSenderId: '403711033846'
};

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
