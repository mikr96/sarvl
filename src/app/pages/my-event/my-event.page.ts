import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import { Router, NavigationExtras } from '@angular/router';
import { CommentComponent } from '../my-event/comment/comment.component'
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins
import { ShowCommentComponent } from './show-comment/show-comment.component';
import { ReplyCommentComponent } from './reply-comment/reply-comment.component';

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
  commentStatus: boolean = false
  unread: any
  name: string;

  constructor(private eventService: EventService, private router: Router, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.eventService.getCreatedEvents().subscribe(resEvent => {
      this.data = resEvent
      this.noEvent = false;
      if (this.data.events === undefined || this.data.events.length == 0) {
        // array empty or does not exist
        this.noEvent = true;
      }
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
      this.eventService.getCreatedEvents().subscribe(resEvent => {
        this.data = resEvent
        this.noEvent = false;
        if (this.data.events === undefined || this.data.events.length == 0) {
          // array empty or does not exist
          this.noEvent = true;
        }
        event.target.complete()
      })
    }, 2000)
  }

  checkComment(comments) {
    let temp = 0
    comments.forEach(data => {
      if (data.comment && data.replies.length < 1) {
        temp = temp + 1
      }
    })
    if (temp > 0) {
      this.commentStatus = true
      return true
    } else {
      this.commentStatus = false
      return true
    }
  }

  async showComment(comments) {
    const modal = await this.modalCtrl.create({
      component: ShowCommentComponent,
      componentProps: {
        comments: JSON.stringify(comments)
      }
    });
    return await modal.present();
  }

  async replyComment(comments) {
    const modal = await this.modalCtrl.create({
      component: ReplyCommentComponent,
      componentProps: {
        comments: JSON.stringify(comments)
      }
    });

    modal.onDidDismiss().then(() => {
      this.eventService.getCreatedEvents().subscribe(resEvent => {
        this.data = resEvent
        this.noEvent = false;
        if (this.data.events === undefined || this.data.events.length == 0) {
          // array empty or does not exist
          this.noEvent = true;
        }
      })
    })

    return await modal.present();
  }

  createEvent() {
    let from = "user"
    this.router.navigate(['/', 'pages', 'create-event'], { state: { from: from } })
  }

  checkStatus(val) {
    if (val == "0") {
      return "Waiting"
    } else if (val == "1") {
      return "Approved"
    } else {
      return "Declined"
    }
  }

  resubmit(item:any) {
    //this.router.navigate(['details'], navigationExtras);
    this.router.navigate(['/', 'pages', 'my-event', 'edit-event'], {state: {item: JSON.stringify(item)}})
    // this.router.navigate(['/', 'pages', 'my-event', 'edit-event', navigationExtras])
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
