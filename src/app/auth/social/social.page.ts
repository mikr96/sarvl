import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-social',
  templateUrl: './social.page.html',
  styleUrls: ['./social.page.scss'],
})
export class SocialPage implements OnInit {
  form : FormGroup
  accessToken : any
  item: any
  id : any
  constructor(private router: Router, private loadingCtrl: LoadingController, private authService: AuthService, private toastCtrl: ToastController) {
    this.item = this.router.getCurrentNavigation().extras.state.item
    this.form = new FormGroup({
      tel: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      password_confirmation: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
   }

  ngOnInit() {
    this.item = JSON.parse(this.item)
    this.accessToken = this.item.access_token
    this.id = this.item.id
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Processing...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.authService.loginWithFB(this.accessToken, this.id, this.form.value.tel, this.form.value.password, this.form.value.password_confirmation)
        .subscribe(
          (res: any) => {
            console.log(res)
            this.form.reset();
            loadingEl.dismiss();
            this.router.navigate(['/', 'auth' ,'register', 'verification'], {state: {item: res.email}})
          },
          err => {
            console.log(err);
            this.form.reset();
            loadingEl.dismiss();
            return this.popToast(JSON.stringify(err,null, 2))
          }
        );
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
}
