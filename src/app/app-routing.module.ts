import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "mainmodule", pathMatch: "full" },
  {
    path: "mainmodule",
    loadChildren: () => import("./home/home.module").then(m => m.HomePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

//imports: [RouterModule.forRoot(routes, {useHash: true})]
