import { Component, OnInit, PipeTransform } from '@angular/core';
import { EventService } from '../../services/event/event.service'
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


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
  activeLatest: boolean = true
  activePopular: boolean = false
  activeEndingSoon: boolean = false

  constructor(private eventService: EventService, private toastController: ToastController, private router: Router, private authService: AuthService) { }

  async popToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'danger',
    })
    toast.present()
  }

  loadMore() {
    this.currentPage += 1
    this.eventService.getByCategory(this.currentPage, this.currentCategory).subscribe(({ events }: any) => {
      this.events = {
        ...events,
        data: [
          ...this.events.data,
          ...events.data
        ]
      }
    }, ({ error }) => this.handleError(error))
  }

  ngOnInit() {
    this.loading = true
    this.eventService.get(this.currentPage)
      .subscribe((data: any) => {
        this.loading = false
        this.events = data.events
        console.log(this.events)
      }, ({ error }) => this.handleError(error))
  }

  changeCategory(category: string) {
    this.loading = true

    if (category === "latest") {
      this.activeLatest = true
      this.activePopular = false
      this.activeEndingSoon = false
    } else if (category === "popular") {
      this.activeLatest = false
      this.activePopular = true
      this.activeEndingSoon = false
    } else if (category === "ending_soon") {
      this.activeLatest = false
      this.activePopular = false
      this.activeEndingSoon = true
    }
    this.currentCategory = category
    this.currentPage = 1
    this.eventService.getByCategory(this.currentPage, this.currentCategory)
      .subscribe((data: any) => {
        this.loading = false
        this.events = data.events
        console.log(this.events)
      }, ({ error }) => this.handleError(error))
  }

  createEvent() {
    let from = "user"
    this.router.navigate(['/', 'pages', 'create-event'], { state: { from: from } })
  }

  goToDetails(item) {
    this.router.navigate(['/', 'pages', 'detail-event'], {state: {item: JSON.stringify(item)}})
  }

  truncate(elem, limit, after) {

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

  private handleError(err: any) {
    return this.popToast(err.error.message)
  }

  doRefresh(event) {
    setTimeout(() => {
      this.eventService.get(this.currentPage)
        .subscribe((data: any) => {
          this.loading = false
          this.events = data.events
          event.target.complete()
        }, ({ error }) => this.handleError(error))
    }, 2000)
  }

}
