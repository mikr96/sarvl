import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import { Router, NavigationExtras } from '@angular/router';
import { CommentComponent } from '../my-event/comment/comment.component'
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { ShowCommentComponent } from './show-comment/show-comment.component';
import { ReplyCommentComponent } from './reply-comment/reply-comment.component';
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
  commentStatus: boolean = false
  unread: any

  constructor(private eventService: EventService, private router: Router, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.eventService.getCreatedEvents().subscribe(resEvent => {
      //console.log(resEvent)
      this.data = resEvent
      console.log(this.data.events)
      this.noEvent = false;
      if (this.data.events === undefined || this.data.events.length == 0) {
        // array empty or does not exist
        this.noEvent = true;
      }
    })
  }

  doRefresh(event) {
    setTimeout(()=> {
      this.eventService.getCreatedEvents().subscribe(resEvent => {
        //console.log(resEvent)
        this.data = resEvent
        //console.log(this.data.events)
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
    let temp = comments.map(data => {
      if (data.replies==null) {
        return
      }
    })
    this.unread = temp.length
    if (this.unread > 0) {
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
    return await modal.present();
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
