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
    return this.http.get(`${URL}admin/events?params=${params}`, {
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

  public getFAQ() {
    return this.http.get(URL + 'faqs')
  }
}
