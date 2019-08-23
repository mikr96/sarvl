import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event/event.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {
  item: any
  formInit: boolean = false
  isLoading: boolean = false;
  constructor(private eventService: EventService, private loadingCtrl: LoadingController, private router: Router, private toastController: ToastController, private route: ActivatedRoute, private navCtrl: NavController) { 

  }
  editEventForm: FormGroup

  ngOnInit() {    
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.item = this.router.getCurrentNavigation().extras.state.item;
      }
    });
      this.item = JSON.parse(this.item)
      console.log(this.item)
      this.editEventForm = new FormGroup({
        image: new FormControl(null),
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
        noVolunteers: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
      });
      this.isLoading = true;
  }

  onImagePicked(imageData: string | File) {
    let imageFile
    if (typeof imageData == 'string') {
      try {
        imageFile = imageData
      } catch (err) {
        console.log(err)
        return;
      }
    } else {
      imageFile = imageData
    }
    this.editEventForm.patchValue({ dp: imageFile })
  }


  onSubmit() {
    if (!this.editEventForm.valid) {
      return;
    }

    console.log(this.editEventForm.value);

    this.loadingCtrl
      .create({
        message: 'Creating...'
      })
      .then(loadingEl => {
        loadingEl.present();
        return this.eventService.editEvent(
          this.editEventForm.value.title,
          new Date(this.editEventForm.value.start_date),
          new Date(this.editEventForm.value.end_date),
          this.editEventForm.value.location,
          this.editEventForm.value.campaign,
          this.editEventForm.value.goal,
          this.editEventForm.value.whatsapp_link,
          this.editEventForm.value.description,
          this.editEventForm.value.dp,
          this.editEventForm.value.noVolunteers,
          this.item.id
        )
          .subscribe(
            res => {
              console.log(res)
              loadingEl.dismiss()
              this.editEventForm.reset()
              this.router.navigate(['/pages/my-event'])
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
