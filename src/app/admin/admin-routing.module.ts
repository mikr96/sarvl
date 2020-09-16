import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
        children: [
          {
            path: '',
            loadChildren: './user-management/user-management.module#UserManagementPageModule'
          },
          {
            path: 'user-detail', 
            loadChildren: './user-management/user-detail/user-detail.module#UserDetailPageModule'
          }
        ]
      },
      { 
        path: 'campaign/:id',
        loadChildren: './campaign/campaign.module#CampaignPageModule'
      },
      { 
        path: 'update', 
        loadChildren: './campaign/update/update.module#UpdatePageModule' 
      },
      { 
        path: 'create', 
        loadChildren: './campaign/create/create.module#CreatePageModule' 
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
        path: 'announcement', 
        loadChildren: './announcement/announcement.module#AnnouncementPageModule' 
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


