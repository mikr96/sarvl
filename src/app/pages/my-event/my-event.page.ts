import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';

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

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventService.getCreatedEvents().subscribe(resEvent => {
      console.log(resEvent)
      this.data = resEvent
    })
  }

  // statusCard(status) {
  //   if (status == "1") {
  //     this.approved = true;
  //   } else if (status == "2") {
  //     this.
  //   }
  // }

}
