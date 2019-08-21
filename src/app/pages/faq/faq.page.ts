import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {

  organizer: boolean = false
  volunteer: boolean = false
  faq: any
  volunteerFaqs: any
  organizerFaqs: any

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventService.getFAQ().subscribe(res => {
      this.faq = res
      this.volunteerFaqs = this.faq.faqs.filter(data => { return data.category === "VOLUNTEER" })
      this.organizerFaqs = this.faq.faqs.filter(data => { return data.category === "ORGANIZER" })
    })
  }

}
