import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ModalController, AlertController, Platform } from '@ionic/angular';
import { AdminEventService } from 'src/app/services/event/admin-event.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { File } from '@ionic-native/file/ngx';
import { ImageModalComponent } from 'src/app/shared/image-modal/image-modal.component';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {
  item : any
  percent: number;
  raised: number;
  update: boolean;
  form: FormGroup
  form2: FormGroup
  decline: boolean = false
  approve: boolean = false
  sliderOpts = {
    zoom: false,
    slidesPerView: 1.5,
    centeredSlides: true,
    spaceBetween: 20
  }
  constructor(private router: Router, private loadingCtrl: LoadingController, private adminEventService: AdminEventService, private toastCtrl: ToastController, private alertCtrl: AlertController, private modalController: ModalController, private file: File, private platform: Platform, private opener: FileOpener, private iab: InAppBrowser) {
    this.item = this.router.getCurrentNavigation().extras.state.item
   }

  ngOnInit() {
    this.form = new FormGroup({
      comment: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
    this.form2 = new FormGroup({
      whatsapp_link: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
    this.item = JSON.parse(this.item)
    console.log(this.item)
  }

  openPDF(url: string) {
    this.iab.create(`http://docs.google.com/gview?embedded=true&url=${url}`,'_blank')
  }

  convertBase64ToBlob(b64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
         const slice = byteCharacters.slice(offset, offset + sliceSize);
         const byteNumbers = new Array(slice.length);
         for (let i = 0; i < slice.length; i++) {
             byteNumbers[i] = slice.charCodeAt(i);
         }
         const byteArray = new Uint8Array(byteNumbers);
         byteArrays.push(byteArray);
    }
   return new Blob(byteArrays, {type: contentType});
}

  viewLink(message: string) {
    this.showAlert(message)
  }

  formatDate(date : string) {
    let temp = date.split(" ");
    return temp[0]
  }

  changeRaised(event, goal: any)  {
    this.percent = event.detail.value
    let data = Number(goal)
    data = data*this.percent/100
    this.raised = data
    this.update = true
    this.item.raised = data
  }

  openPreview(img) {
    this.modalController.create({
      component : ImageModalComponent,
      componentProps : {
        img : img
      }
    }).then(modal => {
      modal.present()
    })
  }

  calculate(val) {
    return Number(val)/10;
  }

  approveEvent(id, campaign) {
    if(this.approve == false) {
      this.approve = true
    } else {
      if (!this.form2.valid) {
        let message = "Please enter the whatsapp link first"
        return this.popToast(message)
      }
    this.loadingCtrl
      .create({
        message: 'Approving...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.adminEventService.approveEvent(id, this.form2.value.whatsapp_link)
        .subscribe(
          res => {
          loadingEl.dismiss()
          this.router.navigate(['/', 'admin', 'campaign', campaign])
        }, 
        err => {
          console.log(err)
          const firstError: any = Object.values(err)[0]
          loadingEl.dismiss()
          this.popToast(firstError)
      })
    });
  }
}


  declineEvent(id, campaign) {
    if(this.decline == false) {
      this.decline = true
    } else {
      if (!this.form.valid) {
        let message = "Please input some comments first"
        return this.popToast(message)
      }
      this.loadingCtrl
      .create({
        message: 'Processing...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.adminEventService.postComment(id, this.form.value.comment)
        .subscribe(
          res => {
          console.log(res)
          loadingEl.dismiss()
          this.router.navigate(['/', 'admin', 'campaign', campaign])
        }, 
        err => {
          console.log(err)
          const firstError: any = Object.values(err)[0]
          loadingEl.dismiss()
          this.popToast(firstError)
      })
    });
    }
  }

  viewMore(user) {
    this.router.navigate(['/', 'admin', 'user-management', 'user-detail'], {state: {user: JSON.stringify(user), status: false}})
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

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Whatsapp Link',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

}
