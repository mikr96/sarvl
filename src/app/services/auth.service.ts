import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject, from } from 'rxjs';
import { map, take, tap, switchMap } from 'rxjs/operators';
import { URL } from '../constants';
import { User } from "../models/user.model"

export interface AuthResponseData {
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _user = new BehaviorSubject<User>(null);

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }

  constructor(private http: HttpClient) {}

  login(profile: Profile) {
    return this.http.post<AuthResponseData>(URL + 'login', profile).pipe(
      tap(this.setToken.bind(this)));
  }

  createAcc(profile: Profile) {
    return this.http.post(URL + 'register', profile);
  }

  logout() {
    this._user.next(null);
    //localStorage.clear();
    Plugins.Storage.remove({ key: 'authData' });
  }

  private setToken(userData: AuthResponseData) {
    const user = new User(
      "volunteer",
      userData.token
    );
    this._user.next(user);
    this.storeToken(userData.token);
  }

  private storeToken(token: string) {
    const data = JSON.stringify({
      token: token
    });
    localStorage.setItem("authData", data)
    Plugins.Storage.set({ key: 'authData', value: data });
  }
}
