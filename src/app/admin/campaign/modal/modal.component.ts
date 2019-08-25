import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { AdminEventService } from 'src/app/services/event/admin-event.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
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
  raised: any
  update: boolean = false
  percent: any
  lastRaised : string = "50"
  constructor(private navParams: NavParams, private modalCtrl: ModalController, private adminEventService: AdminEventService, private loadingCtrl: LoadingController, private toastCtrl: ToastController) { }

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
  }

  dismissModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  changeRaised(event, goal: any)  {
    this.percent = event.detail.value
    let data = Number(goal)
    data = data*this.percent/100
    this.raised = data
    this.update = true
  }

  updateRaised(id) {
    this.loadingCtrl
    .create({
      message: 'Processing...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.adminEventService.updateRaised(id, this.percent.toString())
      .subscribe(
        res => {
        console.log(res)
        loadingEl.dismiss()
      }, 
      err => {
        console.log(err)
        const firstError: string = Object.values(err)[0][0]
        loadingEl.dismiss()
        this.popToast(firstError)
    })
  });
  }

  calculate(val) {
    return 60;
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
