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
import { ViewComponent } from "./view/view.component"
import { GroupSelectorComponent } from "./group-selector/group-selector.component"
import { LearnComponentPOC } from './POCs/learn/learn.component';
const routes: Routes = [
  { path: "", redirectTo: "base", pathMatch: "full" },
  {
    path: "base",
    component: DashBoardComponent,
    children: [
      { path: "", redirectTo: "selectGroup", pathMatch: "full" },
      { path: "allWords", component: AllWordsComponent },
      { path: "practise", component: PractiseComponent },
      { path: "practise/:wordId", component: PractiseComponent },
      { path: "learn", component: LearnComponent },
      { path: "learn/:wordId", component: LearnComponent },
      { path: "learn", component: LearnComponent },
      { path: "selectGroup", component: GroupSelectorComponent },
    ]
  },
  {
    path: "POCs",
    //component: DashBoardComponent, // this would be the parent of all
    children: [
      { path: "", redirectTo: "selectGroup", pathMatch: "full" }, // this is the base url from where user navigations begins
      { path: "bottomSheet", component: BottomSheetComponent },
      { path: "expandableHeader", component: ExpandableHeadearDemoComponent },
      { path: "horizontalSlides", component: HorizontalScrollComponent },
      { path: "animation", component: AnimatedComponent },
      { path: "progressChart", component: HomeScreenComponent },
      { path: "view", component: ViewComponent },
      { path: "selectGroup", component: GroupSelectorComponent },
    ]
  }
];

export const ModuleRouting: ModuleWithProviders = RouterModule.forChild(routes);
