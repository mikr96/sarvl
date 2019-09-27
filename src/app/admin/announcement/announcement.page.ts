import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { AdminEventService } from 'src/app/services/event/admin-event.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.page.html',
  styleUrls: ['./announcement.page.scss'],
})
export class AnnouncementPage implements OnInit {

  form : FormGroup
  announcement: any = {
    limit : 50,
    notifications : [],
    offset : 0,
    total_count : []
  }
  constructor(private toastController: ToastController, private loadingCtrl: LoadingController, private adminEventService : AdminEventService) { }

  ngOnInit() {
    this.form = new FormGroup({
      heading: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      content: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });

    this.adminEventService.getAnnouncement().subscribe((res : any) => {
      this.announcement = res
    })
  }

  doRefresh(event) {
    this.adminEventService.getAnnouncement().subscribe((res : any) => {
      this.announcement = res
      event.target.complete()
    })
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

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Processing...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.adminEventService
          .makeAnnouncement(this.form.value.heading, this.form.value.content)
          .subscribe(res => {
            loadingEl.dismiss()
            if (!res) {
              return this.popToast('Something went wrong...')
            }
            this.form.reset()
          }, (err : any) => {
            loadingEl.dismiss()
            return this.popToast(err.error.message)
          })
      });
  }

}
