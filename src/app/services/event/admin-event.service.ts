import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { URL } from '../../constants'
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminEventService {
  token: string

  constructor(private http: HttpClient, private authService: AuthService) {
    authService.token.subscribe(token => this.token = token)
  }

  get(params: string) {
    return this.http.get(`${URL}admin/events?params=${params}`, {
      headers: {
        Authorization: `bearer ${this.token}`
      }
    });
  }
}
