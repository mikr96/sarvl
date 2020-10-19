import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ToastController, NavParams, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup
  id: any
  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController, private authService: AuthService, private navParams: NavParams, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  resetPass() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Sending...'
      })
      .then(loadingEl => {
        loadingEl.present();
        return this.authService.forgotPassword(this.form.value)
          .subscribe(
            res => {
              loadingEl.dismiss()
              this.form.reset()
              this.dismissModal()
            },
            err => {
              console.log(err)
              const firstError: any = Object.values(err)[0]
              loadingEl.dismiss()
              this.popToast(firstError)
            })
      });
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

  dismissModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
