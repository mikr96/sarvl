import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detail-event',
  templateUrl: './detail-event.page.html',
  styleUrls: ['./detail-event.page.scss'],
})
export class DetailEventPage implements OnInit {
  item: any = []
  message: string;
  method: string;
  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {
    this.item= JSON.parse(localStorage.getItem('item'));
  }

  join() {
    this.message = "Successfully Registered!"
    this.method = "Join"
    this.showAlert(this.message, this.method)
  }

  donate(){
    this.message = "1800262525"
    this.method = "Donate"
    this.showAlert(this.message, this.method)
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
