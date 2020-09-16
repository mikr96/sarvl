import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { URL } from '../../constants'
import { AuthService } from '../auth.service';
import { Faq } from '../../models/faq.model'
import { Welfare } from '../../models/welfare.model'
import { take, switchMap, tap, sampleTime } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class AdminEventService {
  token: string

  constructor(private http: HttpClient, private authService: AuthService) {
    authService.token.subscribe(token => this.token = token)
  }

  get(params: string) {
    return this.http.get(`${URL}admin/events`, {
      headers: {
        Authorization: `bearer ${this.token}`
      }
    });
  }

  public createFAQ(              
    question: string,
    answer: string,
    category: string
  ) {
    let newFaq: Faq;
    let questions = {
      question: question,
      answer: answer
    }
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        newFaq = new Faq(
          questions,
          category.toUpperCase()
        );
        return this.http.post(URL + 'faqs', { ...newFaq }, 
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

  public getByStatus(currentPage, currentCampaign, currentCategory) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get(URL + `admin/events_by_status/${currentCampaign}?status=${currentCategory}&page=${currentPage}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      })
    )
  }

  public getAll(currentPage, currentCampaign, currentCategory) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get(URL + `admin/events_by_status/${currentCampaign}?page=${currentPage}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      })
    )
  }

  public getAllEvent(currentPage) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get(URL + `events?page=${currentPage}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      })
    )
  }

  public getAllEventByStatus(currentPage, status) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get(URL + `events/by_status/${status}?page=${currentPage}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      })
    )
  }

  public getUsers() {
    return this.http.get(URL + 'users')
  }

  public postComment(id, comment) {
    let remark = {
      status: 2,
      remark: comment
    }
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post(URL + `events/${id}/change_status`, {...remark}, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      })
    )
  }

  public processingEvent(id : string) {
    let status = 0
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post(URL + `events/${id}/change_status`, { status }, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      })
    )
  }

  public approveEvent(id : string, wa : string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post(URL + `events/${id}/change_status`, { status: 1, whatsapp_link: wa }, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      })
    )
  }

  public declineEvent(id : string) {
    let status = 2
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post(URL + `events/${id}/change_status`, { status }, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      })
    )
  }

  public updateRaised(id : string, raised : string) {
    let data = {
      raise: raised
    }
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post(URL + `admin/events/${id}/change_raise`, {...data}, {
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

  public makeAnnouncement(heading, content) {
    let today : any = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    const apiRequest = {
      "app_id" : "424f25ed-3aa5-4388-a678-ebc0e02157bd",
      "included_segments": ["All"],
      "data": {
        "task": today
      },
      "headings": {
        "en": heading
      },
      "contents": {
        "en": content
      }
    }
    return this.http.post('https://onesignal.com/api/v1/notifications', apiRequest, {
      headers : {
        "Authorization" : 'Basic MjFmNzg4NTAtMjY3OS00M2YyLWIwOTctYmFlYzA5ODYxNDEx',
        "Content-Type": "application/json; charset=utf-8"
      }
    })
  } 

  public getAnnouncement() {
    return this.http.get('https://onesignal.com/api/v1/notifications?app_id=424f25ed-3aa5-4388-a678-ebc0e02157bd', {
      headers : {
        "Authorization" : 'Basic MjFmNzg4NTAtMjY3OS00M2YyLWIwOTctYmFlYzA5ODYxNDEx',
        "Content-Type": "application/json; charset=utf-8"
      }
    })
  }

  public makeAdmin(id: any) {
    return this.http.get(`${URL}admin/users/${id}/make_admin` , {
      headers: {
        "Authorization" : "Basic MjFmNzg4NTAtMjY3OS00M2YyLWIwOTctYmFlYzA5ODYxNDEx",
        "Content-Type": "application/json; charset=utf-8"
      }
    })
  }
}
