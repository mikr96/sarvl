import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-event',
  templateUrl: './my-event.page.html',
  styleUrls: ['./my-event.page.scss'],
})
export class MyEventPage implements OnInit {
  data: any = {
    events: []
  }
  approved: boolean = false
  rejected: boolean = false
  processing: boolean = false
  noEvent: boolean

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit() {
    this.eventService.getCreatedEvents().subscribe(resEvent => {
      console.log(resEvent)
      this.data = resEvent
      console.log(this.data.events)
      this.noEvent = false;
      if (this.data.events === undefined || this.data.events.length == 0) {
        // array empty or does not exist
        this.noEvent = true;
      }
    })
  }

  resubmit() {
    this.router.navigateByUrl("/pages/create-event")
  }

  // statusCard(status) {
  //   if (status == "1") {
  //     this.approved = true;
  //   } else if (status == "2") {
  //     this.
  //   }
  // }

}
