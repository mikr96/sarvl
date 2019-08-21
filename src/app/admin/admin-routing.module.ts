import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules, Routes } from '@angular/router';
import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardPageModule'
      },
      {
        path: 'user-management',
        loadChildren: './user-management/user-management.module#UserManagementPageModule'
      },
      { 
        path: 'campaign/:id', 
        loadChildren: './campaign/campaign.module#CampaignPageModule' 
      },
      { 
        path: 'faq-admin', 
        children: [
          {
            path: '',
            loadChildren: './faq-admin/faq-admin.module#FaqAdminPageModule'
          },
          {
            path: 'create',
            loadChildren: './faq-admin/create/create.module#CreatePageModule'

          }
        ] 
      },
      {
        path: '',
        redirectTo: '/admin/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/admin/dashboard',
    pathMatch: 'full'
  }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class AdminRoutingModule { }


