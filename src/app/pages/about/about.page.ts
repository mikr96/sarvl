import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event/event.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  name: any;

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
