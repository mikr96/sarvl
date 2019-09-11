import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthPage } from "./auth.page";
import { RouterModule, Routes } from "@angular/router";
import { RegisterPage } from "./register/register.page";

const routes: Routes = [
  {
    path: "register",
    loadChildren: "./register/register.module#RegisterPageModule"
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
