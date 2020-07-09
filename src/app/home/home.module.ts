import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

//mat modules
import { MatExpansionModule } from "@angular/material/expansion";
import { MatChipsModule } from "@angular/material/chips";
import { MatTabsModule } from "@angular/material/tabs"; // used in learning
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from '@angular/material/select';
/// ionic modules
import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";

//five-coreModules
import { FivBottomSheetModule } from "@fivethree/core";

// routing
import { ModuleRouting } from "./sub-routing.module";

import {
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG
} from "@angular/platform-browser";

// internal-components
import { HomePage } from "./home.page";
import { PractiseComponent } from "./practise/practise.component";
import { AllWordsComponent } from "./all-words/all-words.component";
import { LearnComponent } from "./learn/learn.component";
import { FilterPopOverComponent } from "./filter-pop-over/filter-pop-over.component";
import { HowToUseComponent } from "./how-to-use/how-to-use.component";
import { SwipableCardComponent } from "./practise/swipable-card/swipable-card.component";
import { AboutDeveloperComponent } from "./about-developer/about-developer.component";
import { BottomSheetComponent } from "./POCs/bottom-sheet/bottom-sheet.component";
import { ExpandableHeaderComponent } from "../components/expandable-header/expandable-header.component";
import { ExpandableHeadearDemoComponent } from "./expandable-headear-demo/expandable-headear-demo.component"
import { HorizontalScrollComponent } from "./POCs/horizontal-scroll/horizontal-scroll.component"
import { AnimatedComponent } from "./POCs/animated/animated.component"
import { DashBoardComponent } from "./dash-board/dash-board.component"
//internal-services
import { DatabaseService } from "./services/data-base.service";
import { ThemeChangeService } from "./services/theme-change.service";
import { HighlightTextPipe } from "./services/highlight-text.pipe";
import { SvgComponent } from '../components/svg/svg.component';

import { ChartModule } from 'angular2-chartjs';
import { ProgressChartComponent } from './progress-chart/progress-chart.component';
import { ChartsModule } from 'ng2-charts';
import 'chartjs-plugin-zoom';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { ViewComponent } from "./view/view.component";

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'swipe': { velocity: 0.3, threshold: 10 }, // override default settings // new setting for the libraray
    'pan': { threshold: 5 }
  }
}

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
    MatExpansionModule,
    MatSelectModule,
    FivBottomSheetModule,
    ChartModule,
    ChartsModule
  ],
  declarations: [
    HomePage,
    PractiseComponent,
    AllWordsComponent,
    FilterPopOverComponent,
    LearnComponent,
    HighlightTextPipe,
    SwipableCardComponent,
    AboutDeveloperComponent,
    HowToUseComponent,
    BottomSheetComponent,
    ExpandableHeaderComponent,
    ExpandableHeadearDemoComponent,
    HorizontalScrollComponent,
    AnimatedComponent,
    DashBoardComponent,
    SvgComponent,
    ProgressChartComponent,
    HomeScreenComponent,
    ViewComponent
  ],
  providers: [
    DatabaseService,
    HammerGestureConfig,
    ThemeChangeService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  entryComponents: [
    FilterPopOverComponent,
    AboutDeveloperComponent,
    HowToUseComponent
  ],
  exports: [
    SvgComponent

  ]
})
export class HomePageModule { }