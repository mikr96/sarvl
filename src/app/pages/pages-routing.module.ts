import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules, Routes } from '@angular/router';
import { PagesPage } from './pages.page';

const routes: Routes = [
  {
    path: '',
    component: PagesPage,
    children: [
      {
        path: 'home',
        loadChildren: './home/home.module#HomePageModule'
      },
      {
        path: 'profile',
        loadChildren: './profile/profile.module#ProfilePageModule'
      },
      {
        path: 'detail-event',
        loadChildren: './detail-event/detail-event.module#DetailEventPageModule'
      },
      {
        path: 'create-event',
        loadChildren: './create-event/create-event.module#CreateEventPageModule'
      },
      {
        path: 'my-event',
        loadChildren: './my-event/my-event.module#MyEventPageModule'
      },
      { 
        path: 'category/:id', 
        loadChildren: './category/category.module#CategoryPageModule' 
      },
      { 
        path: 'faq', 
        loadChildren: './faq/faq.module#FaqPageModule' 
      },
      { 
        path: 'search', 
        loadChildren: './search/search.module#SearchPageModule' 
      },
      {
        path: '',
        redirectTo: '/pages/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/pages/home',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PagesRoutingModule { }
