import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: 'register',
    children: [
      {
        path: '',
        loadChildren: './register/register.module#RegisterPageModule'
      },
      { 
        path: 'test', 
        loadChildren: './register/verification/verification.module#VerificationPageModule' 
      }
    ]
  },
  { 
    path: 'social', 
    loadChildren: './social/social.module#SocialPageModule' 
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class AuthRoutingModule {}
