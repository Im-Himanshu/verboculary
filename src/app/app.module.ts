import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthService } from "./auth.service"
import { LoginComponent } from "./login/login.component"
import { RegisterComponent } from "./register/register.component"
// 1. Import the libs you need
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { SvgDefinitionsComponent } from './components/svg-definitions/svg-definitions.component';

var firebaseConfig = {
  apiKey: "AIzaSyBAZ6ebK-rQPtF2ZHA5AlEt80esrypQLnY",
  authDomain: "verboculary.firebaseapp.com",
  databaseURL: "https://verboculary.firebaseio.com",
  projectId: "verboculary",
  storageBucket: "verboculary.appspot.com",
  messagingSenderId: "17361230314",
  appId: "1:17361230314:web:cee145231187e029c17a93",
  measurementId: "G-DT360J197T"
};

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, SvgDefinitionsComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule // storage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
