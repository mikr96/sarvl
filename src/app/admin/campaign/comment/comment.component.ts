import { Component, OnInit } from '@angular/core';
import { AdminEventService } from 'src/app/services/event/admin-event.service';
import { NavParams, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {

  id: any
  image: any
  title: any
  description: any 
  start_date: any
  end_date: any
  goal: any
  comments: any 
  location: any
  view_count: any
  noVolunteers: any
  volunteered: any
  whatsapp_link: any
  campaign: any
  form: FormGroup
  constructor(private adminEventService: AdminEventService, private navParams: NavParams, private modalCtrl: ModalController, private loadingCtrl: LoadingController, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.image = this.navParams.get('image')
    this.title = this.navParams.get('title')
    this.description = this.navParams.get('description')
    this.start_date = this.navParams.get('start_date')
    this.start_date = this.start_date.split(" ");
    this.start_date = this.start_date[0]
    this.end_date = this.navParams.get('end_date')
    this.end_date = this.end_date.split(" ");
    this.end_date = this.end_date[0]
    this.goal = this.navParams.get('goal')
    this.comments = this.navParams.get('comments')
    this.location = this.navParams.get('location')
    this.view_count = this.navParams.get('view_count')
    this.noVolunteers = this.navParams.get('noVolunteers')
    this.volunteered = this.navParams.get('volunteered')
    this.whatsapp_link = this.navParams.get('whatsapp_link')
    this.campaign = this.navParams.get('campaign')
    this.form = new FormGroup({
      comment: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  postComment() {
    if (!this.form.valid) {
      return;
    }
    this.id = this.navParams.get('id')
    this.loadingCtrl
    .create({
      message: 'Processing...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.adminEventService.postComment(this.id, this.form.value.comment)
      .subscribe(
        res => {
        console.log(res)
        loadingEl.dismiss()
        this.dismissModal()
      }, 
      err => {
        console.log(err)
        const firstError: string = Object.values(err)[0][0]
        loadingEl.dismiss()
        this.popToast(firstError)
    })
  });
  }

  dismissModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  // private handleError(error: {}) {
  //   const firstError: string = Object.values(error)[0][0]
  //   return this.popToast(firstError)
  // }

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
