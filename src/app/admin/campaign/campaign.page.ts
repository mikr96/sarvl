import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { AdminEventService } from 'src/app/services/event/admin-event.service';
import { EventService } from '../../services/event/event.service';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.page.html',
  styleUrls: ['./campaign.page.scss'],
})
export class CampaignPage implements OnInit {

  isLoading: boolean = false;
  currentCampaign: any
  currentPage: any = 1
  currentCategory: any
  activeAll: boolean = true
  activeApproved: boolean = false
  activeDeclined: boolean = false
  activeRequested: boolean = false
  dataEvent: any = {
    data: [],
    next_page_url: null,
    total: 0
  }
  empty: boolean = false

  constructor(private router: Router, private route: ActivatedRoute, private navCtrl: NavController, private adminEventService: AdminEventService, private eventService: EventService, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/pages/home');
        return;
      }
      this.currentCampaign = paramMap.get('id');
      if(this.currentCampaign == "All") {
        this.currentCategory = 3
        this.adminEventService
        .getAllEventByStatus(this.currentPage, this.currentCategory)
        .subscribe(
          (event: any) => {
            this.isLoading = false;
            this.dataEvent = event.events;
            console.log(this.dataEvent.data)
            this.dataEvent.data.length < 1 ? this.empty = false : this.empty = true
          },
          error => {
            this.handleError(error)
          }
        );
      } else {
        this.currentCategory = 3
        this.adminEventService
        .getAll(this.currentPage, this.currentCampaign, this.currentCategory)
        .subscribe(
          (event: any) => {
            this.isLoading = false;
            this.dataEvent = event.events;
            console.log(this.dataEvent.data.length)
            this.dataEvent.data.length < 1 ? this.empty = false : this.empty = true
          },
          error => {
            this.handleError(error)
          }
        );
      }
    })
  }

  doRefresh(events) {
    setTimeout(()=> {
      this.route.paramMap.subscribe(paramMap => {
        if (!paramMap.has('id')) {
          this.navCtrl.navigateBack('/pages/home');
          return;
        }
        this.currentCampaign = paramMap.get('id');
        if(this.currentCampaign == "All") {
          this.currentCategory = 3
          this.adminEventService
          .getAllEvent(this.currentPage)
          .subscribe(
            (event: any) => {
              this.isLoading = false;
              this.dataEvent = event.events;
              console.log(this.dataEvent.data.length)
              this.dataEvent.data.length < 1 ? this.empty = false : this.empty = true
              events.target.complete()
            },
            error => {
              this.handleError(error)
              events.target.complete()

            }
          );
        } else {
          this.currentCategory = 3
          this.adminEventService
          .getAll(this.currentPage, this.currentCampaign, this.currentCategory)
          .subscribe(
            (event: any) => {
              this.isLoading = false;
              this.dataEvent = event.events;
              console.log(this.dataEvent.data.length)
              this.dataEvent.data.length < 1 ? this.empty = false : this.empty = true
              events.target.complete()

            },
            error => {
              this.handleError(error)
              events.target.complete()
            }
          );
        }
      })
    }, 2000)
  }

  changeCategory(currentCategory) {
    this.isLoading = true
    if(currentCategory === "all") {
      this.activeAll = true
      this.activeApproved = false
      this.activeDeclined = false
      this.activeRequested = false
      this.currentCategory = 3
    } else if (currentCategory === "approved") {
      this.activeAll = false
      this.activeApproved = true
      this.activeDeclined = false
      this.activeRequested = false
      this.currentCategory = 1
    } else if (currentCategory === "declined") {
      this.activeAll = false
      this.activeApproved = false
      this.activeDeclined = true
      this.activeRequested = false
      this.currentCategory = 2
    } else {
      this.activeAll = false
      this.activeApproved = false
      this.activeDeclined = false
      this.activeRequested = true
      this.currentCategory = 0
    }
    this.currentPage = 1
    if(this.currentCampaign == "All") {
      this.adminEventService.getAllEventByStatus(this.currentPage, this.currentCategory)
      .subscribe( (data: any) => {
        this.isLoading = false
        this.dataEvent = data.events
        this.dataEvent.data.length < 1 ? this.empty = false : this.empty = true
      })
    } else {
      if(this.currentCategory != 3) {
        this.adminEventService.getByStatus(this.currentPage, this.currentCampaign, this.currentCategory)
          .subscribe((data: any) => {
            this.isLoading = false
            this.dataEvent = data.events
            this.dataEvent.data.length < 1 ? this.empty = false : this.empty = true
          }, ({ error }) => this.handleError(error))
      } else {
        this.adminEventService
        .getAll(this.currentPage, this.currentCampaign, this.currentCategory)
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
      }
    }
  }

  viewDetail(item) {
    this.router.navigate(['/', 'admin', 'update'], {state: {item: JSON.stringify(item)}})
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

  checkStatus(val) {
    if (val == "0") {
      return "Waiting"
    } else if (val == "1") {
      return "Approved"
    } else {
      return "Declined"
    }
  }

  private handleError(error: {}) {
    const firstError: string = Object.values(error)[0][0]
    return this.popToast(firstError)
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
