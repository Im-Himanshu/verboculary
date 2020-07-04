import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {HomePage} from './home.page'
import {PractiseComponent} from './practise/practise.component'
import {AllWordsComponent} from './all-words/all-words.component'
import {LearnComponent} from "./learn/learn.component"
const routes: Routes = [
  { path: '', redirectTo: 'base', pathMatch: 'full' },
  {   path: 'base',                 
      component: HomePage, 
      children : [{ path: '', redirectTo: 'allWords', pathMatch: 'full' },
                  { path: 'allWords', component: AllWordsComponent},
                  { path: 'practise', component: PractiseComponent},                  
                  { path: 'practise/:wordId', component: PractiseComponent},                  
                  { path: 'learn', component: LearnComponent},
                  { path: 'learn/:wordId', component: LearnComponent}
                ]
      }

  
];

export const ModuleRouting: ModuleWithProviders = RouterModule.forChild(routes);
