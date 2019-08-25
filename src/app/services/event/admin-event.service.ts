import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { URL } from '../../constants'
import { AuthService } from '../auth.service';
import { Faq } from '../../models/faq.model'
import { take, switchMap, tap } from 'rxjs/operators';
 
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
        console.log(newFaq)
        return this.http.post(URL + 'faqs', { ...newFaq }, 
        { 
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
      })
    )
  }

  public getByStatus(currentPage, currentCampaign, currentCategory) {
    console.log("campaign: ", currentCampaign)
    console.log("category: ", currentCategory)
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
        return this.http.put(URL + `events/${id}/change_status`, {...remark}, {
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
        return this.http.put(URL + `events/${id}/change_status`, { status }, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      })
    )
  }

  public approveEvent(id : string) {
    let status = 1
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.put(URL + `events/${id}/change_status`, { status }, {
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
        return this.http.put(URL + `events/${id}/change_status`, { status }, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      })
    )
  }

  public updateRaised(id : string, raised : string) {
    let data = {
      raised: raised
    }
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.put(URL + `/updateRaised${id}`, {...data}, {
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
}
