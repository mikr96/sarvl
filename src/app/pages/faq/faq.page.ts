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

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventService.getFaq().subscribe(res => {
      console.log(res)
    })
  }

}
