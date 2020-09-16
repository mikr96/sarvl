import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/event/event.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welfare-assistant',
  templateUrl: './welfare-assistant.page.html',
  styleUrls: ['./welfare-assistant.page.scss'],
})
export class WelfareAssistantPage implements OnInit {
  eventForm: FormGroup

  constructor(private eventService: EventService, private loadingCtrl: LoadingController, private router: Router, private toastController: ToastController) {}

  ngOnInit() {
    this.eventForm = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      no_kp: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      hospital: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      sender_list: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      health_issues: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      sender_tel_no: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      sender_kp_no: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      relationship: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      sarawak_address: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      current_address: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  async onSubmit() {
    if (!this.eventForm.valid) {
      return this.popToast('Please fill in the form')
    }
    this.loadingCtrl
      .create({
        message: 'Creating...'
      })
      .then(loadingEl => {
        loadingEl.present();
        return this.eventService.createWelfareAssistant(
          this.eventForm.value.name,
          this.eventForm.value.no_kp,
          this.eventForm.value.hospital,
          this.eventForm.value.health_issues,
          this.eventForm.value.sender_list,
          this.eventForm.value.sender_kp_no,
          this.eventForm.value.sender_tel_no,
          this.eventForm.value.relationship,
          this.eventForm.value.sarawak_address,
          this.eventForm.value.current_address
        )
          .subscribe(
            res => {
              console.log(this.eventForm.value)
              loadingEl.dismiss()
              this.eventForm.reset()
              this.router.navigate(['/pages/home'])
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
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: 'danger',
    })
    toast.present()
  }
}
