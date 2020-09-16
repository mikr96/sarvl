import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ToastController, NavParams, ModalController } from '@ionic/angular';
import { EventService } from 'src/app/services/event/event.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup
  id: any
  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController, private eventService: EventService, private navParams: NavParams, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.form = new FormGroup({
      current_password: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      new_password: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      new_password_confirmation: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  updatePass() {
    if (!this.form.valid) {
      return;
    }
    this.id = this.navParams.get('id')
    this.loadingCtrl
      .create({
        message: 'Creating...'
      })
      .then(loadingEl => {
        loadingEl.present();
        return this.eventService.updatePassword(this.id, this.form.value)
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
