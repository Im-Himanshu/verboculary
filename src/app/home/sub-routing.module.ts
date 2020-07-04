import { RouterModule, Routes } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { HomePage } from "./home.page";
import { PractiseComponent } from "./practise/practise.component";
import { AllWordsComponent } from "./all-words/all-words.component";
import { LearnComponent } from "./learn/learn.component";
import { BottomSheetComponent } from "./POCs/bottom-sheet/bottom-sheet.component";
import { ExpandableHeadearDemoComponent } from "./expandable-headear-demo/expandable-headear-demo.component"
import { HorizontalScrollComponent } from "./POCs/horizontal-scroll/horizontal-scroll.component"
import { AnimatedComponent } from "./POCs/animated/animated.component"
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { DashBoardComponent } from "./dash-board/dash-board.component"
import { ProgressChartComponent } from './progress-chart/progress-chart.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
const routes: Routes = [
  { path: "", redirectTo: "POCs", pathMatch: "full" },
  {
    path: "base",
    component: HomePage,
    children: [
      { path: "", redirectTo: "allWords", pathMatch: "full" },
      { path: "allWords", component: AllWordsComponent },
      { path: "practise", component: PractiseComponent },
      { path: "practise/:wordId", component: PractiseComponent },
      { path: "learn", component: LearnComponent },
      { path: "learn/:wordId", component: LearnComponent }
    ]
  },
  {
    path: "POCs",
    children: [
      { path: "", redirectTo: "bottomSheet", pathMatch: "full" },
      { path: "bottomSheet", component: BottomSheetComponent },
      { path: "expandableHeader", component: ExpandableHeadearDemoComponent },
      { path: "horizontalSlides", component: HorizontalScrollComponent },
      { path: "animation", component: AnimatedComponent },
      { path: "dashBoard", component: DashBoardComponent },
      { path: "progressChart", component: HomeScreenComponent }
    ]
  }
];

export const ModuleRouting: ModuleWithProviders = RouterModule.forChild(routes);
