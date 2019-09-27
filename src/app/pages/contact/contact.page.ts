import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins
import { EventService } from 'src/app/services/event/event.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  name: string;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.setFullname()
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
  
}
