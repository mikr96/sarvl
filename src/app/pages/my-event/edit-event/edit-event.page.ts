import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event/event.service';
import { Capacitor, Plugins, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  item: any
  formInit: boolean = false
  isLoading: boolean = false;
  image: any
  imagePicker: any
  selectedImage: string
  usePicker = false;
  constructor(private eventService: EventService, private loadingCtrl: LoadingController, private router: Router, private toastController: ToastController, private route: ActivatedRoute, private navCtrl: NavController, private platform: Platform) { 
    this.item = this.router.getCurrentNavigation().extras.state.item
  }
  editEventForm: FormGroup

  ngOnInit() {    
    this.item = JSON.parse(this.item)
    this.selectedImage = this.item.image
      this.editEventForm = new FormGroup({
        images: new FormControl(this.item.image),
        title: new FormControl(this.item.title, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        start_date: new FormControl(this.item.start_date, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        end_date: new FormControl(this.item.end_date, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        location: new FormControl(this.item.location, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        campaign: new FormControl(this.item.campaign, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        goal: new FormControl(this.item.goal, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        description: new FormControl(this.item.description, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        noVolunteers: new FormControl(this.item.noVolunteers, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        proposal: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
      });
      this.isLoading = false;
      if (this.platform.is('mobile') && !this.platform.is('hybrid') || this.platform.is('desktop')) {
        this.usePicker = true;
      }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      // height: 320,
      width: 300,
      resultType: CameraResultType.Base64
    })
      .then(image => {
        this.selectedImage = `data:image/jpeg;base64,${image.base64String}`;
        this.onImagePicked(image.base64String);
      })
      .catch(error => {
        console.log(error);
        if (this.usePicker) {
          this.filePickerRef.nativeElement.click();
        }
        return false;
      });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.onImagePicked(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = imageData
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.editEventForm.patchValue({ images: imageFile });
  }

  onFilePicked (event : any) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.editEventForm.patchValue({ proposal: dataUrl });
    };
    fr.readAsDataURL(pickedFile);
  }

  onSubmit() {
    if (!this.editEventForm.valid) {
      return;
    }

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
          this.editEventForm.value.description,
          this.editEventForm.value.images,
          this.editEventForm.value.noVolunteers,
          this.item.id,
          this.editEventForm.value.proposal
        )
          .subscribe(
            res => {
              loadingEl.dismiss()
              this.editEventForm.reset()
              this.router.navigate(['/pages/my-event'])
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
      duration: 2000,
      position: 'top',
      color: 'danger',
    })
    toast.present()
  }

}
