import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import { Router, NavigationExtras } from '@angular/router';
import { CommentComponent } from '../my-event/comment/comment.component'
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins

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

  constructor(private eventService: EventService, private router: Router, private modalCtrl: ModalController) { }

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

  resubmit(item:any) {
    let navigationExtras: NavigationExtras = {
      state: {
        item: JSON.stringify(item)
      }
    };
    //this.router.navigate(['details'], navigationExtras);
    this.router.navigate(['/', 'pages', 'my-event', 'edit-event', navigationExtras])
  }

  async viewComment(remark) {
    const modal = await this.modalCtrl.create({
      component: CommentComponent,
      componentProps: {
        remark: remark
      }
    });
    return await modal.present();
  }

  date(date:string) {
    if(date == null || date == undefined){
      return 0
    }
    let temp = date.split(" ")
    return temp[0]
  }

}
