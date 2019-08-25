import { Component, OnInit } from '@angular/core';
import { AdminEventService } from 'src/app/services/event/admin-event.service';

@Component({
  selector: 'app-faq-admin',
  templateUrl: './faq-admin.page.html',
  styleUrls: ['./faq-admin.page.scss'],
})
export class FaqAdminPage implements OnInit {
  faq: any
  volunteerFaqs: any
  organizerFaqs: any
  organizer: boolean = false
  volunteer: boolean = false
  constructor(private adminEventService: AdminEventService) { }

  ngOnInit() {
    this.adminEventService.getFAQ().subscribe(res => {
      this.faq = res
      this.volunteerFaqs = this.faq.faqs.filter(data => { return data.category === "VOLUNTEER" })
      this.organizerFaqs = this.faq.faqs.filter(data => { return data.category === "ORGANIZER" })
    })
  }

  doRefresh(event) {
    setTimeout(()=> {
      this.adminEventService.getFAQ().subscribe(res => {
        this.faq = res
        this.volunteerFaqs = this.faq.faqs.filter(data => { return data.category === "VOLUNTEER" })
        this.organizerFaqs = this.faq.faqs.filter(data => { return data.category === "ORGANIZER" })
        event.target.complete()
      })
    }, 2000)
  }

}
