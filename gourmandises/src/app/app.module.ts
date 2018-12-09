import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');
import { AppComponent } from './app.component';

import { appRoutes } from './app.routes';
import { RouterModule } from '@angular/router';
import { MainModule } from './main/main.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    MainModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled'
    })
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
