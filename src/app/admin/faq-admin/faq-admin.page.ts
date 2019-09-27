import { Component, OnInit } from '@angular/core';
import { AdminEventService } from 'src/app/services/event/admin-event.service';
import { EventService } from 'src/app/services/event/event.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins

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
  name: any;
  constructor(private adminEventService: AdminEventService, private eventService: EventService) { }

  ngOnInit() {
    this.adminEventService.getFAQ().subscribe(res => {
      this.faq = res
      this.volunteerFaqs = this.faq.faqs.filter(data => { return data.category === "VOLUNTEER" })
      this.organizerFaqs = this.faq.faqs.filter(data => { return data.category === "ORGANIZER" })
      this.setFullname()
    })
  }
  
  async setFullname() {
    try {
      const ret = await Storage.get({ key: 'fullname' });
      this.name = ret.value;
      this.eventService.setFullname(this.name);
    } catch (err) {
      console.log(err)
    }
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
