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
<<<<<<< HEAD
import { Deeplinks } from "@ionic-native/deeplinks/ngx";
import { Media } from "@ionic-native/media/ngx";
import { File } from "@ionic-native/file/ngx";
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { DatePipe } from "@angular/common";
=======
import { Deeplinks }  from '@ionic-native/deeplinks/ngx'
import { Ng2SearchPipeModule } from 'ng2-search-filter';

>>>>>>> 1c7c676d993a2c756697ef7e2ece9f5be5fe16f5

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
    File,
    FileTransfer,
    FileTransferObject,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
