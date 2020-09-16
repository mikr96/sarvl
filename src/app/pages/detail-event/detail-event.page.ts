import { Component, OnInit, NgZone } from '@angular/core';
import { AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { EventService, EventData } from '../../services/event/event.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ImageModalComponent } from 'src/app/shared/image-modal/image-modal.component';

@Component({
  selector: 'app-detail-event',
  templateUrl: './detail-event.page.html',
  styleUrls: ['./detail-event.page.scss'],
})
export class DetailEventPage implements OnInit {

  item : any
  sliderOpts = {
    zoom: false,
    slidesPerView: 1.5,
    centeredSlides: true,
    spaceBetween: 20
  }

  message: string;
  method: string;
  comment: string
  commentsDiv: boolean = false
  constructor(private alertCtrl: AlertController, private eventService: EventService, private loadingCtrl: LoadingController, private router: Router, private toastController: ToastController, private modalController: ModalController) { 
    this.item = this.router.getCurrentNavigation().extras.state.item
  }

  ngOnInit() {
    this.item = JSON.parse(this.item)
    this.eventService.viewCount(this.item.id).subscribe()
  }

  join(id: string, whatsapp_link : any) {
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
              this.showAlert(this.message, this.method, whatsapp_link)
            },
            err => {
              loadingEl.dismiss()
              this.popToast(err.error.message)
            })
      });
  }

  joinGroup(whatsapp_link : any) {
    window.open(whatsapp_link, '_system');
  }

  openPreview(img) {
    this.modalController.create({
      component : ImageModalComponent,
      componentProps : {
        img : img
      }
    }).then(modal => {
      modal.present()
    })
  }

  daysLeft(startDate: string) {
    let c = new Date()
    let a = moment(c, 'M/D/YYYY');
    let b = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
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
              loadingEl.dismiss()
              this.popToast(err.error.message)
            })
      });
  }

  len(val) {
    if (val == null) {
      return 0
    }
    return Object.keys(val).length
  }

  date(date: string) {
    if (date == null || date == undefined) {
      return 0
    }
    let temp = date.split(" ")
    return temp[0]
  }

  reply(data) {
    if (data.length == 0) {
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

  private async showAlert(message: string, method: string, whatsapp_link : string) {
    let alert
    if (method === "Donate") {
      const alertIc = await this.alertCtrl
                      .create({
                        header: 'Donate Now',
                        message: message,
                        buttons: ['Okay']
                      })
      await alertIc.present()

    } else {
      const alertEl = await this.alertCtrl.create({
          header: 'Join Now',
          message: message,
          buttons: ['Okay']
        })
      await alertEl.present();        
      alertEl.onDidDismiss().then((data) => {
        window.open(whatsapp_link, '_system');
      });
    }
  }
}
