import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminEventService } from 'src/app/services/event/admin-event.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})

export class UserDetailPage implements OnInit {

  user : any
  tutup : boolean = false
  status : boolean = true

  constructor(private router: Router, private adminService: AdminEventService, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private alertCtrl: AlertController) { 
    this.user = this.router.getCurrentNavigation().extras.state.user
    this.status = this.router.getCurrentNavigation().extras.state.status
  }

  ngOnInit() {
    this.user = JSON.parse(this.user)
    this.user.role === "admin" ? this.tutup = false : this.tutup = true
    console.log(this.user)
  }

  getSkill(skills) {
    let log = skills.map(data => { return data.skill })
    return skills.length > 1 ? `${log[0]}, ${log[1]}` : `${log[0]}`
  }

  makeAdmin(id) {
    this.loadingCtrl
    .create({
      message: 'Processing...'
    })
    .then(loadingEl => {
      loadingEl.present();
      return this.adminService.makeAdmin(id)
      .subscribe(
        res => {
        loadingEl.dismiss()
        this.successAlert()
       }, 
        err => {
          loadingEl.dismiss()
          let message = "System is temporary unavailable. Please try again later."
          this.popToast(message)
        })
    });
  }

  async successAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Congratulations !',
      message: 'Succesfully updated',
      buttons: [{
        text : 'OK',
        handler: () => {
          this.tutup = true        
        }
      }]
    });

    await alert.present();
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
