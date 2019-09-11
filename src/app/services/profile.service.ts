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
        return this.authService.token.pipe(
          take(1),
          switchMap(token => {
            return this.http.post(
              `${URL}users/${id}/edit`, profile, { 
                headers: {
                  Authorization: 'Bearer ' + token
                }
              }
            );
          })
        )
      })
    )
  }

  // uploadImage(image: File) {
  //   const uploadData = new FormData();
  //   uploadData.append('image', image);

  //   return this.authService.token.pipe(
  //     take(1),
  //     switchMap(token => {
  //       return this.http.post<{ imageUrl: string; imagePath: string }>(
  //         'https://us-central1-ionic-angular-course.cloudfunctions.net/storeImage',
  //         uploadData,
  //         { headers: { Authorization: 'Bearer ' + token } }
  //       );
  //     })
  //   );
  // }
}
