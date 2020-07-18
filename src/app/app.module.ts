import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthService } from "./auth.service";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { DatabaseService } from "./home/services/data-base.service";
import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from "@angular/common/http";

// 1. Import the libs you need
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { SvgDefinitionsComponent } from "./components/svg-definitions/svg-definitions.component";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { Deeplinks }  from '@ionic-native/deeplinks/ngx'
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SlidesComponent } from './home/POCs/slides/slides.component'
import { Media } from "@ionic-native/media/ngx";
import { SuperTabsModule } from "@ionic-super-tabs/angular";
import { AppRate } from '@ionic-native/app-rate/ngx';

var firebaseConfig = {
  apiKey: "AIzaSyBAZ6ebK-rQPtF2ZHA5AlEt80esrypQLnY",
  authDomain: "verboculary.firebaseapp.com",
  databaseURL: "https://verboculary.firebaseio.com",
  projectId: "verboculary",
  storageBucket: "verboculary.appspot.com",
  messagingSenderId: "17361230314",
  appId: "1:17361230314:web:cee145231187e029c17a93",
  measurementId: "G-DT360J197T",
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SvgDefinitionsComponent,
    SlidesComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
    HttpClientModule,
    Ng2SearchPipeModule,
    SuperTabsModule.forRoot(),
  ],
  providers: [
    DatabaseService,
    StatusBar,
    SplashScreen,
    AuthService,
    Deeplinks,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SocialSharing,
    Media,
    AppRate
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
