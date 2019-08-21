import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ToastController, LoadingController, ModalController } from '@ionic/angular';
import { AdminEventService } from 'src/app/services/event/admin-event.service';
import { EventService } from '../../services/event/event.service';
import { ModalComponent } from './modal/modal.component';

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

  constructor(private router: Router, private route: ActivatedRoute, private navCtrl: NavController, private adminEventService: AdminEventService, private eventService: EventService, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private zone: NgZone, private modalCtrl: ModalController) { }

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
          console.log(this.dataEvent)
        },
        error => {
          this.handleError(error)
        }
      );
    })
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
    if(this.currentCategory != 3) {
      this.adminEventService.getByStatus(this.currentPage, this.currentCampaign, this.currentCategory)
        .subscribe((data: any) => {
          this.isLoading = false
          this.dataEvent = data.events
          console.log(this.dataEvent)
        }, ({ error }) => this.handleError(error))
    } else {
      this.adminEventService
      .getAll(this.currentPage, this.currentCampaign, this.currentCategory)
      .subscribe(
        (event: any) => {
          this.isLoading = false;
          this.dataEvent = event.events;
          console.log(this.dataEvent)
        },
        error => {
          this.handleError(error)
        }
      );
    }
  }

  approveEvent(id) {
    this.loadingCtrl
      .create({
        message: 'Processing...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.adminEventService.approveEvent(id)
        .subscribe(
          res => {
          console.log(res)
          loadingEl.dismiss()
          this.zone.run(() => {
            console.log('force update the screen');
          });
        }, 
        err => {
          console.log(err)
          const firstError: string = Object.values(err)[0][0]
          loadingEl.dismiss()
          this.popToast(firstError)
      })
    });
  }

  declineEvent(id) {
    this.loadingCtrl
      .create({
        message: 'Processing...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.adminEventService.declineEvent(id)
        .subscribe(
          res => {
          console.log(res)
          loadingEl.dismiss()
          this.zone.run(() => {
            console.log('force update the screen');
          });
        }, 
        err => {
          console.log(err)
          const firstError: string = Object.values(err)[0][0]
          loadingEl.dismiss()
          this.popToast(firstError)
      })
    });
  }

  async viewDetail(item) {
    console.log(item)
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        image: item.image,
        title: item.title,
        description: item.description,
        start_date: item.start_date,
        end_date: item.end_date,
        goal: item.goal,
        comments: item.comments,
        location: item.location,
        view_count: item.view_count,
        noVolunteers: item.noVolunteers,
        volunteered: item.volunteered,
        whatsapp_link: item.whatsapp_link,
        campaign: item.campaign
      }
    });
    return await modal.present();
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
    console.log(val)
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
