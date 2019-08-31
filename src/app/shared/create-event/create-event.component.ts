import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/event/event.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {

  eventForm: FormGroup
  imageFile : any = [];

  constructor(private eventService: EventService, private loadingCtrl: LoadingController, private router: Router, private toastController: ToastController) {
    this.eventForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      start_date: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      end_date: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      location: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      campaign: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      goal: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      whatsapp_link: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      images: new FormControl(null),
      noVolunteers: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
   }

   ngOnInit() {

   }

  onImagePicked(imageData: string | File) {
    if (typeof imageData === 'string') {
      try {
        this.imageFile.push(imageData)
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      this.imageFile.push(imageData)
    }
    console.log(this.imageFile)
    this.eventForm.patchValue({ images: this.imageFile });
  }


  onSubmit() {
    if (!this.eventForm.valid) {
      return;
    }

    console.log(this.eventForm.value);

    this.loadingCtrl
      .create({
        message: 'Creating...'
      })
      .then(loadingEl => {
        loadingEl.present();
        return this.eventService.createEvent(
          this.eventForm.value.title,
          new Date(this.eventForm.value.start_date),
          new Date(this.eventForm.value.end_date),
          this.eventForm.value.location,
          this.eventForm.value.campaign,
          this.eventForm.value.goal,
          this.eventForm.value.whatsapp_link,
          this.eventForm.value.description,
          this.eventForm.value.images,
          this.eventForm.value.noVolunteers
        )
          .subscribe(
            res => {
              console.log(res)
              loadingEl.dismiss()
              this.eventForm.reset()
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
