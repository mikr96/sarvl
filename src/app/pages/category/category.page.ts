import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event/event.service';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  currentPage: number = 1
  currentCategory: string = 'latest'
  currentCampaign: string
  category: string = ''
  isLoading = false
  dataEvent: any = {
    data: [],
    next_page_url: null,
    total: 0
  }
  img: boolean;
  activeLatest: boolean = true;
  activePopular: boolean = false;
  activeEndingSoon: boolean = false;
  empty: boolean 

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/pages/home');
        return;
      }
      this.currentCampaign = paramMap.get('id');
      this.eventService
      .getEventByCampaign(this.currentCampaign, this.currentPage)
      .subscribe(
        (event: any) => {
          this.isLoading = false;
          this.dataEvent = event.events;
          this.dataEvent.data.length < 1 ? this.empty = false : this.empty = true
        },
        error => {
          this.handleError(error)
        }
      );
    })
  }

  loadMore() {
    this.currentPage += 1
    this.eventService.getEventByCampaign(this.currentCampaign, this.currentPage).subscribe(({ events }: any) => {
      this.dataEvent = {
        ...events,
        data: [
          ...this.dataEvent.data,
          ...events.data
        ]
      }
    }, ({ error }) => this.handleError(error))
  }

  doRefresh(event) {
    setTimeout(()=> {
      this.isLoading = true;
      this.route.paramMap.subscribe(paramMap => {
        if (!paramMap.has('id')) {
          this.navCtrl.navigateBack('/pages/home');
          return;
        }
        this.currentCampaign = paramMap.get('id');
        this.eventService
        .getEventByCampaign(this.currentCampaign, this.currentPage)
        .subscribe(
          (event: any) => {
            this.isLoading = false;
            this.dataEvent = event.events;
          },
          error => {
            this.handleError(error)
          }
          );
          event.target.complete()
      })
    }, 2000)
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

  changeCategory(category: string) {
    this.isLoading = true
    if(category === "latest") {
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
    this.eventService.getEventByCampaignWithCategory(this.currentPage, this.currentCampaign, this.currentCategory)
      .subscribe((data: any) => {
        this.isLoading = false
        this.dataEvent = data.events
      }, ({ error }) => this.handleError(error))
  }

  goToDetails(item) {
    Storage.set({ key: 'item', value: JSON.stringify(item) })
    this.router.navigateByUrl('/pages/detail-event')
  }

  private handleError(err : any) {
    return this.popToast(err.error.message)
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
