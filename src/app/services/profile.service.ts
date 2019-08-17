import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { URL } from '../constants';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  getProfile() {
    return this.authService.userId.pipe(
      take(1),
      switchMap(id => {
        return this.http.get(
          `${URL}users/${id}`
        );
      })
    )
  }

  editProfile(profile: Profile) {
    return this.authService.userId.pipe(
      take(1),
      switchMap(id => {
        return this.http.put(
          `${URL}users/${id}`, profile
        );
      })
    )
  }
}
