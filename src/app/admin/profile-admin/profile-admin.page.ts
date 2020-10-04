import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Capacitor, Plugins, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { ChangePasswordAdminComponent } from './change-password-admin/change-password-admin.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event/event.service';
const { Storage } = Plugins

@Component({
  selector: 'app-profile-admin',
  templateUrl: './profile-admin.page.html',
  styleUrls: ['./profile-admin.page.scss'],
})
export class ProfileAdminPage implements OnInit, OnDestroy {
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  myphoto: string = "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
  changes: boolean = false;
  name: string
  username: string
  telefon: string
  location: string
  profile: any = {
    user: []
  }
  editForm: FormGroup
  private profileSub: Subscription;
  isLoading = false;
  selectedImage: string
  usePicker = false;
  id: any
  stateSelected : any
  states : any = ["Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang", "Penang",  "Perak", "Perlis", "Sabah", "Sarawak", "Selangor", "Terengganu", "WP Kuala Lumpur", "WP Labuan"]
  constructor(private profileService: ProfileService, private platform: Platform, private loadingCtrl: LoadingController, private toastController: ToastController, private modalCtrl: ModalController, private authService: AuthService, private router: Router, private eventService: EventService) { }

  ngOnInit() {
    this.isLoading = true;
    this.profileSub = this.profileService.getProfile().subscribe(res => {
      this.profile = res
      this.selectedImage = this.profile.user.dp
      this.id = this.profile.user.id
      this.editForm = new FormGroup({
        username: new FormControl(this.profile.user.username, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        fullname: new FormControl(this.profile.user.fullname, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        telNo: new FormControl(this.profile.user.telNo, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        location: new FormControl(this.profile.user.location, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        occupation: new FormControl(this.profile.user.occupation, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        dp: new FormControl(this.profile.user.dp)
      });
      this.stateSelected = this.profile.user.location
      this.isLoading = false;
    })
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.usePicker = true;
    }
    this.setFullname()
  }
  
  async setFullname() {
    try {
      const ret = await Storage.get({ key: 'fullname' });
      this.name = ret.value;
      this.eventService.setFullname(this.name);
    } catch (err) {
      console.log(err)
    }
  }

  doRefresh(event) {
    setTimeout(()=> {
      this.isLoading = true;
      this.profileSub = this.profileService.getProfile().subscribe(res => {
        this.profile = res
        this.selectedImage = this.profile.user.dp
        this.id = this.profile.user.id

        this.editForm.patchValue({ 
          dp: this.profile.user.dp,
          username: this.profile.user.username, 
          fullname: this.profile.user.fullname,
          telNo: this.profile.user.telNo,
          location: this.profile.user.location,
          occupation: this.profile.user.occupation
        })
        this.isLoading = false
      })
      if (
        (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
        this.platform.is('desktop')
      ) {
        this.usePicker = true;
      }
        event.target.complete()
    }, 2000)
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
        this.onImagePicked(`data:image/jpeg;base64,${image.base64String}`);
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
    this.editForm.patchValue({ dp: imageFile });
  }

  onEdit() {
    if (!this.editForm.valid) {
      return this.popToast('Please fill in the form');
    }

    this.loadingCtrl
      .create({
        message: 'Processing...'
      })
      .then(loadingEl => {
        loadingEl.present();
        if(!this.profile.user.dp){
          this.editForm.patchValue({ dp: 'none' });
        }
        this.profileService
          .editProfile(this.editForm.value)
          .subscribe(res => {
            loadingEl.dismiss()
            if (!res) {
              return this.popToast('Something went wrong...')
            } else {
              // return this.popToast('Something went wrong...')
            }
          }, ( err : any ) => {
            loadingEl.dismiss()
            return this.popToast(err.error.message)
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

  ngOnDestroy() {
    if (this.profileSub) {
      this.profileSub.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }

  async changePass() {
    const modal = await this.modalCtrl.create({
      component: ChangePasswordAdminComponent,
      componentProps: {
        id: this.id
      }
    });
    return await modal.present();
  }

}
