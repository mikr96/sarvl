import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../constants';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Event } from '../../models/event.model'
import { AuthService } from '../auth.service';
import * as moment from 'moment';

export interface EventData {
  title: string,
  start_date: any,
  end_date: any,
  location: string,
  goal: string,
  whatsapp_link: string,
  description: string
}

@Injectable({
  providedIn: 'root'
})

export class EventService {
  private _events = new BehaviorSubject<Event[]>([]);

  get events() {
    return this._events.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) { }

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

  public createEvent(              
    title: string,
    start_date: Date,
    end_date: Date,
    location: string,
    goal: string,
    whatsapp_link: string,
    description: string
  ) {
    let newEvent: Event;
    var start = moment(start_date);
    var newStart = start.format("YYYY-MM-DD HH:mm:ss"); 
    var end = moment(end_date);
    var newEnd = end.format("YYYY-MM-DD HH:mm:ss"); 
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        console.log(token)
        newEvent = new Event(
          title,
          newStart,
          newEnd,
          location,
          goal,
          whatsapp_link,
          description
        );
        return this.http.post(URL + 'events', { ...newEvent }, 
        { 
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
      }),
      take(1),
      tap(events => {
        // this._events.next(events.next(newEvent));
      })
    )
  }
}
