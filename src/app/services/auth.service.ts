import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject, from, Subject } from 'rxjs';
import { map, take, tap, switchMap } from 'rxjs/operators';
import { URL } from '../constants';
import { User } from "../models/user.model"

export interface AuthResponseData {
  token: string
  isAdmin: boolean
  user_id: string,
  user: any
}

const { Storage } = Plugins

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

  get user() {
    return this._user.asObservable().pipe(
      map(user => {
        if (!user)
          return null
        return user.getUser
      })
    )
  }

  get isAdmin() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) return user.isAdmin
        else return null
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

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  constructor(private http: HttpClient) { }

  login(profile: Profile) {
    return this.http.post<AuthResponseData>(URL + 'login', profile).pipe(
      tap(this.setToken.bind(this)));
  }

  loginWithFB(access_token: any, id: any, tel: any, password: any, password_confirmation: any) {
    return this.http.post(URL + `social_login/${access_token}`,{
      id : id,
      telNo: tel,
      password : password,
      password_confirmation : password_confirmation
    })
  }

  getID(token:string) {
    return this.http.get(`https://graph.facebook.com/me?access_token=${token}`)
  }

  createAcc(profile: Profile) {
    console.log(profile)
    return this.http.post(URL + 'register', profile);
  }

  requestVerificationNumber(username: any) {
    return this.http.post(`${URL}users/send_verification`, {
      username: username
    })
  }

  verifyAccount(username: any, verifyNum: any) {
    return this.http.post(`${URL}users/verify`, {
      username: username,
      verify_num: verifyNum
    })
  }

  forgotPassword(email: any) {
    return this.http.post(`${URL}users/forgot-password`, {
      email: email
    })
  }

  logout() {
    this._user.next(null);
    Storage.clear();
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }

        const userData = JSON.parse(storedData.value) as {
          token: string;
          isAdmin: boolean;
          user_id: string;
        };

        if(userData.isAdmin == true) {
          const user = new User(
            "admin",
            userData.token,
            userData.isAdmin,
            userData.user_id
          )
          Storage.set({ key: 'role', value: "admin" })
          return user;
        } else {
          const user = new User(
            "volunteer",
            userData.token,
            userData.isAdmin,
            userData.user_id
          )
          Storage.set({ key: 'role', value: "volunteer" })
          return user;
        }   
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  private setToken(userData: AuthResponseData) {
    let user
    if(userData.isAdmin == true) {
      user = new User(
        "admin",
        userData.token,
        userData.isAdmin,
        userData.user_id
      )
    } else {
      user = new User(
        "volunteer",
        userData.token,
        userData.isAdmin,
        userData.user_id
      )
    }

    user.user = userData.user

    this._user.next(user)
    this.storeToken(userData.token, userData.isAdmin, userData.user_id);
  }

  private storeToken(token: string, isAdmin: boolean, user_id: string) {
    const data = JSON.stringify({
      user_id: user_id,
      token: token,
      isAdmin: isAdmin
    })
    Storage.set({ key: 'authData', value: data })
  }
}
