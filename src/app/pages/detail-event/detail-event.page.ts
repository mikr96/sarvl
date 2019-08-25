import { Component, OnInit, NgZone } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { EventService } from '../../services/event/event.service';
import { Plugins } from '@capacitor/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
const { Storage } = Plugins

@Component({
  selector: 'app-detail-event',
  templateUrl: './detail-event.page.html',
  styleUrls: ['./detail-event.page.scss'],
})
export class DetailEventPage implements OnInit {
  item: any = []
  message: string;
  method: string;
  comment: string
  commentsDiv: boolean = false
  constructor(private alertCtrl: AlertController, private eventService: EventService, private loadingCtrl: LoadingController, private router: Router, private toastController: ToastController) {}

  ngOnInit() {
    this.getObject()
  }

  async getObject() {
    const ret = await Storage.get({ key: 'item' });
    this.item = JSON.parse(ret.value);
    console.log(this.item)
    this.eventService.viewCount(this.item.id).subscribe()
  }

  join(id:string) {
    this.message = "Successfully Registered!"
    this.method = "Join"
    this.loadingCtrl
    .create({
      message: 'Creating...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.eventService.joinEvent(id)
      .subscribe(
        res => {
        loadingEl.dismiss()
        this.showAlert(this.message, this.method)
      }, 
      err => {
        console.log(err)
        const firstError: string = Object.values(err)[0][0]
        loadingEl.dismiss()
        this.popToast(firstError)
    })
  });
    
    
  }

  donate(){
    this.message = "1800262525"
    this.method = "Donate"
    this.showAlert(this.message, this.method)
  }

  daysLeft(startDate: string) {
    let c = new Date()
    let a = moment(c,'M/D/YYYY');
    let b = moment(startDate,'YYYY-MM-DD HH:mm:ss');
    let diffDays = b.diff(a, 'days');
    return diffDays
  }

  postComment(id) {
    this.loadingCtrl
    .create({
      message: 'Creating...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.eventService.postComment(this.comment, id)
      .subscribe(
        res => {
        loadingEl.dismiss()
        this.router.navigate(['/pages/home'])
      }, 
      err => {
        console.log(err)
        const firstError: string = Object.values(err)[0][0]
        loadingEl.dismiss()
        this.popToast(firstError)
    })
  });
  }

  len(val) {
    if(val == null){
      return 0
    }
    return Object.keys(val).length
  }

  date(date:string) {
    if(date == null || date == undefined){
      return 0
    }
    let temp = date.split(" ")
    return temp[0]
  }

  reply(data) {
    if(data.length == 0) {
      return false
    }
    return true
  }

  async popToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'danger',
    })
    toast.present()
  }

  private showAlert(message: string, method: string) {
    if (method === "Donate") {
      this.alertCtrl
        .create({
          header: 'Donate Now',
          message: message,
          buttons: ['Okay']
        })
        .then(alertEl => alertEl.present());
    } else {
      this.alertCtrl
      .create({
        header: 'Join Now',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
    }
  }
}
