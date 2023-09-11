import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component"
import { RegisterComponent } from "./register/register.component"
import { SlidesComponent } from './home/POCs/slides/slides.component';
const routes: Routes = [
  { path: "", redirectTo: "mainmodule", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "slides", component: SlidesComponent },
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
export class AppRoutingModule { }

//imports: [RouterModule.forRoot(routes, {useHash: true})]
