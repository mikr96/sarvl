import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins

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
  name: any;

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit() {
    this.eventService.getFAQ().subscribe(res => {
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
      this.eventService.getFAQ().subscribe(res => {
        this.faq = res
        this.volunteerFaqs = this.faq.faqs.filter(data => { return data.category === "VOLUNTEER" })
        this.organizerFaqs = this.faq.faqs.filter(data => { return data.category === "ORGANIZER" })
        event.target.complete()
      })
    }, 2000)
  }

  searchPage() {
    this.router.navigate(['/', 'pages', 'faq', 'search'], {state: {faq: JSON.stringify(this.faq)}})
  }

}
