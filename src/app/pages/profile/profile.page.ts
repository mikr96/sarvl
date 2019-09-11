import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Capacitor, Plugins, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
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
  states : any = ["Johor Darul Ta'zim", "Kedah Darul Aman", "Kelantan Darul Naim", "Malacca", "Negeri Sembilan Darul Khusus", "Pahang Darul Makmur", "Penang Perak Darul Ridzuan", "Perlis Indera Kayangan", "Sabah", "Sarawak", "Selangor Darul Ehsan", "Terengganu Darul Iman"]
  constructor(private profileService: ProfileService, private platform: Platform, private loadingCtrl: LoadingController, private toastController: ToastController, private modalCtrl: ModalController, private authService: AuthService, private router: Router) { }

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
          location: this.profile.user.location
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
    if (!this.editForm.valid || !this.editForm.get('dp').value) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Processing...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.profileService
          .editProfile(this.editForm.value)
          .subscribe(res => {
            loadingEl.dismiss()
            console.log('res', res)
            if (!res) {
              return this.popToast('Something went wrong...')
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
      component: ChangePasswordComponent,
      componentProps: {
        id: this.id
      }
    });
    return await modal.present();
  }

}
