import { RouterModule, Routes } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { HomePage } from "./home.page";
import { PractiseComponent } from "./practise/practise.component";
import { LearnComponent } from "./learn/learn.component";
import { BottomSheetComponent } from "./POCs/bottom-sheet/bottom-sheet.component";
import { ExpandableHeadearDemoComponent } from "./expandable-headear-demo/expandable-headear-demo.component";
import { HorizontalScrollComponent } from "./POCs/horizontal-scroll/horizontal-scroll.component";
import { AnimatedComponent } from "./POCs/animated/animated.component";
import { HowToUseComponent } from "./how-to-use/how-to-use.component";
import { DashBoardComponent } from "./dash-board/dash-board.component";
import { ProgressChartComponent } from "./progress-chart/progress-chart.component";
import { ViewComponent } from "./view/view.component";
import { WordSetsComponent } from "./word-sets/word-sets.component";
import { ShareComponent } from "./POCs/share/share.component";

import { SlidesComponent } from "./POCs/slides/slides.component";
import { AdMobComponent } from "./POCs/ad-mob/ad-mob.component";
import { AudioComponent } from "./POCs/audio/audio.component";

const routes: Routes = [
  { path: "", redirectTo: "POCs", pathMatch: "full" },
  {
    path: "base",
    component: HomePage,
    children: [
      { path: "", redirectTo: "wordSets/begineer-1", pathMatch: "full" },
      { path: "practise", component: PractiseComponent },
      { path: "practise/:wordId", component: PractiseComponent },
      { path: "learn", component: LearnComponent },
      { path: "learn/:wordId", component: LearnComponent },
      { path: "learn", component: LearnComponent },
      { path: "dashboard", component: DashBoardComponent },
      { path: "wordSets/:setName", component: WordSetsComponent }, // defaul
      { path: "wordSets/:setName/:viewType", component: WordSetsComponent }, // default
      {
        path: "wordSets/:setName/:viewType/:wordId",
        component: WordSetsComponent,
      }, // in case specifc view and specific word is to be loaded
    ],
  },
  {
    path: "POCs",
    //component: DashBoardComponent, // this would be the parent of all
    children: [
      { path: "", redirectTo: "audio", pathMatch: "full" }, // this is the base url from where user navigations begins
      { path: "bottomSheet", component: BottomSheetComponent },
      { path: "expandableHeader", component: ExpandableHeadearDemoComponent },
      { path: "horizontalSlides", component: HorizontalScrollComponent },
      { path: "animation", component: AnimatedComponent },
      { path: "view", component: ViewComponent },
      { path: "slides", component: SlidesComponent },
      { path: "admob", component: AdMobComponent },
      { path: "share", component: ShareComponent },
      { path: "audio", component: AudioComponent },
    ],
  },
];

export const ModuleRouting: ModuleWithProviders = RouterModule.forChild(routes);
