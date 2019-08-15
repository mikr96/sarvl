import { Component, OnInit, PipeTransform } from '@angular/core';
import { EventService } from '../../services/event/event.service'
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
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
  img: boolean = true
  errors: any
  currentCategory: string = 'latest'

  constructor(private eventService: EventService, private toastController: ToastController, private router: Router) { }

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

  goToDetails(item) {
    localStorage.setItem('item', JSON.stringify(item));
    this.router.navigateByUrl('/pages/detail-event')
  }

  truncate (elem, limit, after) {

    // Make sure an element and number of items to truncate is provided
    if (!elem || !limit) return;
  
    // Get the inner content of the element
    var content = elem;
  
    // Convert the content into an array of words
    // Remove any words above the limit
    content = content.split(' ').slice(0, limit);
  
    // Convert the array of words back into a string
    // If there's content to add after it, add it
    content = content.join(' ') + (after ? after : '');
    // Inject the content back into the DOM
    return content;
  
  };

  statusImage(val) {
    if (val == null){
      this.img = true;
    } else {
      this.img = false;
    }
  }

  private handleError(error: {}) {
    const firstError: string = Object.values(error)[0][0]
    return this.popToast(firstError)
  }

}
