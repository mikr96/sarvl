import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminEventService } from 'src/app/services/event/admin-event.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  form: FormGroup
  constructor(private adminEventService: AdminEventService, private loadingCtrl: LoadingController, private router: Router, private toastController: ToastController) { }

  ngOnInit() {
    this.form = new FormGroup({
      question: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      answer: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      category: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onSubmit(){
    if (!this.form.valid) {
      return;
    }
    
    console.log(this.form.value);

    this.loadingCtrl
    .create({
      message: 'Creating...'
    })
    .then(loadingEl => {
      loadingEl.present();
      return this.adminEventService.createFAQ(
        this.form.value.question,
        this.form.value.answer,
        this.form.value.category,
      )
      .subscribe(
        res => {
        console.log(res)
        loadingEl.dismiss()
        this.form.reset()
        this.router.navigate(['/admin/faq-admin'])
      }, 
      err => {
        console.log(err)
        const firstError: string = Object.values(err)[0][0]
        loadingEl.dismiss()
        this.popToast(err.error.message)
    })
  });
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
}
