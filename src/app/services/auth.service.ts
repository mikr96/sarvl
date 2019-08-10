import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = false;
  url : string = "http://localhost/volunteer-sarawak-api/public/"

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  constructor(private http: HttpClient) {}

  authenticated() {
    this._userIsAuthenticated = true;
  }

  login(profile: Profile) {
    return this.http.post(this.url + 'login', profile);
  }

  createAcc(profile: Profile) {
    return this.http.post(this.url + 'register', profile);
  }

  logout() {
    this._userIsAuthenticated = false;
  }
}
