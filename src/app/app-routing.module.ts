import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: "", redirectTo: "pages", pathMatch: "full" },
  { path: "auth", loadChildren: "./auth/auth.module#AuthPageModule" },
  { path: 'pages', loadChildren: './pages/pages.module#PagesPageModule', canLoad: [AuthGuard] },
  { path: 'admin', loadChildren: './admin/admin.module#AdminPageModule', canLoad: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
