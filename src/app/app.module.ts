import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { File } from '@ionic-native/file/ngx'
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

export const firebaseConfig = {
  apiKey: "AIzaSyAYSf5QGgflfLO99_qJh8KJIS72vWkA2ok",
  authDomain: "sarawak-volunteer.firebaseapp.com",
  projectId: "sarawak-volunteer",
  storageBucket: "gs://sarawak-volunteer.appspot.com/",
  messagingSenderId: "31798403922"
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    OneSignal, File, FileTransfer, FileChooser, FilePath, Base64, FileOpener, InAppBrowser
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
