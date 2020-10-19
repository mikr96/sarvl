import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { AuthPage } from "./auth.page";
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterPage } from './register/register.page';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: "",
        component: AuthPage
      }
    ]),
    AuthRoutingModule,
    ForgotPasswordModule
  ],
  declarations: [AuthPage]
})
export class AuthPageModule {}
