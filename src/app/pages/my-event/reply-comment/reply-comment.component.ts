import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController, ToastController } from '@ionic/angular';
import { EventService } from 'src/app/services/event/event.service';

@Component({
  selector: 'app-reply-comment',
  templateUrl: './reply-comment.component.html',
  styleUrls: ['./reply-comment.component.scss'],
})
export class ReplyCommentComponent implements OnInit {
  comments: any
  comment: string
  bakiComment: boolean
  constructor(private modalCtrl: ModalController, private navParams: NavParams, private eventService: EventService, private loadingCtrl: LoadingController, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.comments = this.navParams.get('comments')
    this.comments = JSON.parse(this.comments)
    this.bakiComment = true
  }

  dismissModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  replyComment(id, user_type) {
    let body = {
      comment: this.comment,
      user_type: user_type
    }
    this.loadingCtrl
    .create({
      message: 'Creating...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.eventService.replyComment(id, body)
      .subscribe(
        res => {
        this.comments = this.comments.filter(data => data.id != id)
        this.comments.length < 1 ? this.bakiComment = false : this.bakiComment = true
        loadingEl.dismiss()
      }, 
      err => {
        console.log(err)
        const firstError: string = Object.values(err)[0][0]
        loadingEl.dismiss()
        this.popToast(err.error.message)
    })
  });
  }

  len(val) {
    let temp = val.length
    if (temp>0) {
      return true
    } else {
      return false
    }
  }

  async popToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'danger',
    })
    toast.present()
  }

}
