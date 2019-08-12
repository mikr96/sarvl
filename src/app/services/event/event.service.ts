import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  /**
   * getEvents
   */
  public get(page: number = 1) {
    return this.http.get(`${URL}events?page=${page}`)
  }

  /**
   * getPopular
   */
  public getByCategory(page: number = 1, category: string = 'latest') {
    return this.http.get(`${URL}events/by_category/${category}?page=${page}`)
  }
}
