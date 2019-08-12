import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';
import { HttpClient } from '@angular/common/http';
import { URL } from 'url';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = false;

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  constructor(private http: HttpClient) { }

  authenticated() {
    this._userIsAuthenticated = true;
  }

  login(profile: Profile) {
    return this.http.post(URL + 'login', profile);
  }

  createAcc(profile: Profile) {
    return this.http.post(URL + 'register', profile);
  }

  logout() {
    this._userIsAuthenticated = false;
  }
}
