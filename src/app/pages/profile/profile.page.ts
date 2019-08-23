import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

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

  constructor(private profileService: ProfileService, private loadingCtrl: LoadingController, private toastController: ToastController) { }

  ngOnInit() {
    this.isLoading = true;
    this.profileSub = this.profileService.getProfile().subscribe(res => {
      this.profile = res
      this.editForm = new FormGroup({
        username: new FormControl(this.profile.user.fullname, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        fullname: new FormControl(this.profile.user.username, {
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
      this.isLoading = false;
    })
  }

  onImagePicked(imageData: string | File) {
    let imageFile
    if (typeof imageData == 'string') {
      try {
        // imageFile = base64toBlob(
        //   imageData.replace('data:image/jpeg;base64,', ''),
        //   'image/jpeg'
        // );
        imageFile = imageData
      } catch (err) {
        console.log(err)
        return;
      }
    } else {
      imageFile = imageData
    } 
      this.editForm.patchValue({ dp:imageFile })
  }

  onEdit() {
    if (!this.editForm.valid || !this.editForm.get('dp').value) {
      return;
    }
    //console.log(this.editForm.value)
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
          }, ({ error }) => {
            console.error(error)
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

  ngOnDestroy() {
    if (this.profileSub) {
      this.profileSub.unsubscribe();
    }
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
