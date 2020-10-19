import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../constants';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Event } from '../../models/event.model'
import { AuthService } from '../auth.service';
import * as moment from 'moment';
import { Welfare } from '../../models/welfare.model'
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


export interface EventData {
  title: string,
  id: string,
  start_date: any,
  end_date: any,
  location: string,
  campaign: string,
  goal: string,
  description: string,
  images: [],
  noVolunteers: any,
  raise: any,
  joined: any,
  comments: any,
  proposal: any
}

@Injectable({
  providedIn: 'root'
})

export class EventService {
  private _events = new BehaviorSubject<Event[]>([]);

  get events() {
    return this._events.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService, private iab:InAppBrowser) { }
  
  /**
   * getEvents
   */
  public get(page: number = 1) {
    // return this.http.get(`${URL}events?page=${page}`)
    return this.http.get(`${URL}events/by_category/latest?page=${page}`)
  }

  /**
   * getPopular
   */
  public getByCategory(page: number = 1, category: string = 'latest') {
    return this.http.get(`${URL}events/by_category/${category}?page=${page}`)
  }

  public getEventByCampaign(campaign: string, page: number = 1) {
    return this.http.get(`${URL}events/by_campaign/${campaign}?page=${page}`)
  }

  public getCreatedEvents() {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get(URL + `created_events`,
          {
            headers: {
              Authorization: 'Bearer ' + token
            }
          });
      })
    );
  }

  public postComment(comment: string, id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post(URL + `comments/${id}`, { comment },
          {
            headers: {
              Authorization: 'Bearer ' + token
            }
          });
      })
    );
  }

  public replyComment(id, body) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post(URL + `comments/${id}/reply`, { ...body },
          {
            headers: {
              Authorization: 'Bearer ' + token
            }
          });
      })
    );
  }

  public joinEvent(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get(URL + `join_event/${id}`,
          {
            headers: {
              Authorization: 'Bearer ' + token
            }
          });
      })
    );
  }

  public createEvent(
    title: string,
    start_date: Date,
    end_date: Date,
    location: string,
    campaign: string,
    goal: string,
    description: string,
    images: any,
    noVolunteers: string,
    proposal: string,
    file: string
  ) {
    let newEvent: Event;
    var start = moment(start_date);
    var newStart = start.format("YYYY-MM-DD HH:mm:ss");
    var end = moment(end_date);
    var newEnd = end.format("YYYY-MM-DD HH:mm:ss");
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        let id = ''
        let newCampaign = campaign.split(" ")
        newEvent = new Event(
          title,
          newStart,
          newEnd,
          location,
          newCampaign[0],
          goal,
          description,
          images,
          noVolunteers,
          id,
          file
        );
        return this.http.post(URL + 'events', { ...newEvent },
          {
            headers: {
              Authorization: 'Bearer ' + token
            }
          });
      })
    )
  }

  public createWelfareAssistant(              
    name : string,
    no_kp : string,
    hospital : string,
    health_issues : string,
    sender_list : string,
    sender_kp_no : string,
    sender_tel_no : string,
    relationship : string,
    sarawak_address : string,
    current_address : string
  ) {
    let newWelfare: Welfare;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        newWelfare = new Welfare(
          name,
          no_kp,
          hospital,
          health_issues,
          sender_list,
          sender_kp_no,
          sender_tel_no,
          relationship,
          sarawak_address,
          current_address
        );
        return this.http.post(URL + 'welfare_assistants ', { ...newWelfare },
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

  public counter(){
    return this.http.patch(URL + 'playstore_click_counts', { }).pipe(
      take(1),
      tap(() => {
        this.iab.create('https://play.google.com/store/apps/details?id=com.baxter.myapp&hl=en','_system')  
      })
    )
  }

  public editEvent(
    title: string,
    start_date: Date,
    end_date: Date,
    location: string,
    campaign: string,
    goal: string,
    description: string,
    dp: any,
    noVolunteers: string,
    id: any,
    proposal: string
  ) {
    let newEvent: Event;
    var start = moment(start_date);
    var newStart = start.format("YYYY-MM-DD HH:mm:ss");
    var end = moment(end_date);
    var newEnd = end.format("YYYY-MM-DD HH:mm:ss");
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        let newCampaign = campaign.split(" ")
        newEvent = new Event(
          title,
          newStart,
          newEnd,
          location,
          newCampaign[0],
          goal,
          description,
          dp,
          noVolunteers,
          id,
          proposal
        );
        return this.http.post(URL + `events/${id}/edit`, { ...newEvent },
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

  public updatePassword(id, data) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post(URL + `users/${id}/change_password`, { ...data }, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      })
    )
  }


  public viewCount(event_id: any) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get(URL + `events/update_count/${event_id}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
        )
      })
    )
  }

  public getEventByCampaignWithCategory(page: number = 1, campaign: string, category: string = 'latest') {
    return this.http.get(`${URL}events/by_campaign_category?category=${category}&campaign=${campaign}&page=${page}`)
  }

  public getComment(id) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get(URL + `comments/${id}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      })
    )
  }


  public getFAQ() {
    return this.http.get(URL + 'faqs')
  }

  // Observable string sources
  private fullname = new Subject<any>();
  // Observable string streams
  fullname$ = this.fullname.asObservable();
  // Service message commands
  setFullname(change: any) {
    this.fullname.next(change);
  }
}
