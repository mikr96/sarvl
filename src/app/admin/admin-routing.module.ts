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
          },
          { 
            path: 'search', 
            loadChildren: './user-management/search/search.module#SearchPageModule' 
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
        path: 'profile-admin', 
        loadChildren: './profile-admin/profile-admin.module#ProfileAdminPageModule' 
      },
      { 
        path: 'igps-admin', 
        loadChildren: './igps-admin/igps-admin.module#IgpsAdminPageModule' 
      },
      { 
        path: 'welfare-assistant-admin', 
        children: [
          {
            path: '', 
            loadChildren: './welfare-assistant-admin/welfare-assistant-admin.module#WelfareAssistantAdminPageModule' 
          },
          {
            path: 'form-detail', 
            loadChildren: './welfare-assistant-admin/detail-form/detail-form.module#DetailFormPageModule' 
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


