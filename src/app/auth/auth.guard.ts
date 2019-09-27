import { Injectable } from '@angular/core';
import { CanLoad, Router, Route, UrlSegment } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, tap, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  role: any;

  constructor(private authService: AuthService, private router: Router) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): any {
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap((isAuthenticated: any) => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated)
        }
      }),
      tap((isAuthenticated: any) => {
        if(!isAuthenticated) {
          this.router.navigateByUrl('/auth')
        } 
      })
    );
  }
}
