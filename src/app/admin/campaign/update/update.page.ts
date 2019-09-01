import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ModalController, AlertController } from '@ionic/angular';
import { AdminEventService } from 'src/app/services/event/admin-event.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  constructor(private router: Router, private loadingCtrl: LoadingController, private adminEventService: AdminEventService, private toastCtrl: ToastController, private alertCtrl: AlertController) {
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
      bank_account: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
    this.item = JSON.parse(this.item)
    console.log(this.item)
  }

  viewLink(message: string) {
    this.showAlert(message)
  }

  formatDate(date : string) {
    let temp = date.split(" ");
    console.log(temp)
    return temp[0]
  }

  changeRaised(event, goal: any)  {
    this.percent = event.detail.value
    let data = Number(goal)
    data = data*this.percent/100
    this.raised = data
    this.update = true
  }

  updateRaised(id) {
    this.loadingCtrl
    .create({
      message: 'Updating...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.adminEventService.updateRaised(id, this.percent.toString())
      .subscribe(
        res => {
        console.log(res)
        loadingEl.dismiss()
        this.update = false
      }, 
      err => {
        console.log(err)
        const firstError: string = Object.values(err)[0][0]
        loadingEl.dismiss()
        this.popToast(err.error.message)
    })
  });
  }

  calculate(val) {
    return Number(val)/10;
  }

  approveEvent(id, campaign) {
    if(this.approve == false) {
      this.approve = true
    } else {
      if (!this.form2.valid) {
        let message = "Please state your bank account number first"
        return this.popToast(message)
      }
    this.loadingCtrl
      .create({
        message: 'Approving...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.adminEventService.approveEvent(id, this.form2.value.bank_account)
        .subscribe(
          res => {
          console.log(res)
          loadingEl.dismiss()
          console.log(campaign)
          this.router.navigate(['/', 'admin', 'campaign', campaign])
        }, 
        err => {
          console.log(err)
          const firstError: string = Object.values(err)[0][0]
          loadingEl.dismiss()
          this.popToast(err.error.message)
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
          const firstError: string = Object.values(err)[0][0]
          loadingEl.dismiss()
          this.popToast(err.error.message)
      })
    });
    }
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
