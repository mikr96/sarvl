import { Component, OnInit } from '@angular/core';
import { AdminEventService } from 'src/app/services/event/admin-event.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-welfare-assistant-admin',
  templateUrl: './welfare-assistant-admin.page.html',
  styleUrls: ['./welfare-assistant-admin.page.scss'],
})
export class WelfareAssistantAdminPage implements OnInit {

  welfare : any
  dataForm: any = {
    data: [],
    next_page_url: null,
    total: 0
  }
  isLoading: boolean = false
  empty: boolean = false

  constructor(private eventService: AdminEventService, private router: Router, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.isLoading = true;
    this.eventService.getWelfare().subscribe((res:any) => {
      this.isLoading = false;
      this.empty = true
      this.dataForm = res.data;
    })
  }

  doRefresh(events) {
    setTimeout(() => {
      this.eventService.getWelfare().subscribe((res:any) => {
        this.isLoading = false;
        this.empty = true
        this.dataForm = res.data;
      }),
      error => {
        this.handleError(error)
        events.target.complete()
      }
    }, 2000)
  }

  viewMore(form){
    this.router.navigate(['/', 'admin', 'welfare-assistant-admin', 'form-detail'], {state: {form: JSON.stringify(form)}})
  }

  private handleError(err: any) {
    return this.popToast(err.error)
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
}
