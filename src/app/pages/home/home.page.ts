import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service'
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  currentPage: number = 1
  events: any = {
    data: [],
    next_page_url: null,
    total: 0
  }
  loading: boolean = true
  errors: any
  currentCategory: string = 'latest'

  constructor(private eventService: EventService, private toastController: ToastController) { }

  async popToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'danger',
    })
    toast.present()
  }

  ngOnInit() {
    this.loading = true
    this.eventService.get(this.currentPage)
    .subscribe((data: any) => {
        this.loading = false
        this.events = data.events
      }, ({ error }) => this.handleError(error))
  }

  changeCategory(category: string) {
    this.loading = true
    this.currentCategory = category
    this.currentPage = 1
    this.eventService.getByCategory(this.currentPage, this.currentCategory)
      .subscribe((data: any) => {
        this.loading = false
        this.events = data.events
      }, ({ error }) => this.handleError(error))
  }

  private handleError(error: {}) {
    const firstError: string = Object.values(error)[0][0]
    return this.popToast(firstError)
  }

}
