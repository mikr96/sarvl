import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
  username: any
  timeleft: any = "Send TAC"
  timer: any
  counter: any = 0
  block: boolean = false
  TACnum: string
  constructor(private router: Router, private authService: AuthService, private toastCtrl: ToastController, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { 
    this.username = this.router.getCurrentNavigation().extras.state.item
  }

  ngOnInit() {
  }

  sendTAC() {
    this.counter += 1
    this.counter == 1 ? this.timeleft = 10 :
    this.counter == 2 ? this.timeleft = 30 :
    this.counter == 3 ? this.timeleft = 60 : this.failAlert() 
    this.block = true
    this.authService.requestVerificationNumber(this.username).subscribe(
      res => {
        console.log(res)
        let countdown = setInterval(() => {
          this.timeleft -= 1;
          if(this.timeleft <= 0){
            this.timeleft= "Re-Send TAC"
            this.block = false
            clearInterval(countdown);
          }
        }, 1000);
      }, err => {
        this.popToast(err)
      })
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

  async failAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      message: 'You have requested TAC more than 3 times, the system is going temporary unavailable. Please try it again later.',
      buttons: [{
        text : 'Back to Login',
        handler: () => {
          this.router.navigateByUrl("/auth")      
        }
      }]
    });

    await alert.present();
  }

  verify() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Verifying ...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.authService.verifyAccount(this.username, this.TACnum).subscribe(
          res => {
            console.log(res)
            let message = "Your account has been verified. You can now login with your credentials."
            loadingEl.dismiss();
            this.showAlert(message)
          },
          err => {
            console.log(err);
            let message = 'Fail to verify. Please try again.';
            this.popToast(message)
            loadingEl.dismiss();
          }
        );
      });
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Successful',
        message: message,
        buttons: [{
          text: 'Back to Login',
          handler: () => {
            this.router.navigateByUrl("/auth")        
          } }]
      })
      .then(alertEl => alertEl.present());
  }

  

}
