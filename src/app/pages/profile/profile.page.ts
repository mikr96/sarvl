import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

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

  constructor(private profileService: ProfileService, private loadingCtrl: LoadingController, private toastController: ToastController) { }

  ngOnInit() {
    this.editForm = new FormGroup({
      username: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      fullname: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      ic: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });

    this.profileService.getProfile().subscribe(res => {
      this.profile = res
      this.name = this.profile.user.fullname
      this.username = this.profile.user.username
      this.telefon = this.profile.user.ic
      this.location = "Kuching, Sarawak"
    })
  }

  onEdit() {
    if (!this.editForm.valid) {
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
          if (!res) {
            return this.popToast('Something went wrong...')
          }
        }, ({ error }) => {
          const firstError: string = Object.values(error)[0][0]
          loadingEl.dismiss()
          return this.popToast(firstError)
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



  // public presentActionSheet() {
  //   let actionSheet = this.actionSheetCtrl.create({
  //   title: 'Select Image Source',
  //   buttons: [
  //    {
  //      text: 'Load from Library',
  //      handler: () => {
  //        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  //      }
  //    },
  //    {
  //      text: 'Use Camera',
  //      handler: () => {
  //        this.takePicture(this.camera.PictureSourceType.CAMERA);
  //      }
  //    },
  //    {
  //      text: 'Cancel',
  //      role: 'cancel'
  //    }
  //   ]
  //  });
  //   actionSheet.present();
  //  }
  // }

}
