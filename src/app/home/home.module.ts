import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


//mat modules
import {MatExpansionModule} from '@angular/material/expansion';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';// used in learning 
import { FormsModule } from '@angular/forms';

/// ionic modules 
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';


// routing
import { ModuleRouting } from './sub-routing.module';



import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

// internal-components 
import { HomePage } from './home.page';
import {PractiseComponent} from './practise/practise.component'
import {AllWordsComponent} from './all-words/all-words.component'
import {LearnComponent} from "./learn/learn.component"
import {FilterPopOverComponent} from "./filter-pop-over/filter-pop-over.component"
import {HowToUseComponent} from "./how-to-use/how-to-use.component"
import {SwipableCardComponent} from "./practise/swipable-card/swipable-card.component"
import {AboutDeveloperComponent} from "./about-developer/about-developer.component";

//internal-services
import {DatabaseService} from './services/data-base.service'
import {ThemeChangeService} from './services/theme-change.service'
import { HighlightTextPipe } from './services/highlight-text.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ModuleRouting,
    IonicStorageModule.forRoot(),
    MatTabsModule,
    MatChipsModule,
    MatExpansionModule
  ],
  declarations: [
    HomePage,PractiseComponent,AllWordsComponent,
    FilterPopOverComponent,LearnComponent, HighlightTextPipe,
    SwipableCardComponent,AboutDeveloperComponent,HowToUseComponent
  ],
  providers: [
    DatabaseService,
    HammerGestureConfig,
    ThemeChangeService,
    { 
      provide: HAMMER_GESTURE_CONFIG, 
      useClass: HammerGestureConfig 
    }
  ],
  entryComponents: [FilterPopOverComponent,AboutDeveloperComponent,HowToUseComponent],
})
export class HomePageModule {}
