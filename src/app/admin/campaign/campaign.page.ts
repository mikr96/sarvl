import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
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
  activeAll: boolean = true
  activeApproved: boolean = false
  activeDeclined: boolean = false
  activeRequested: boolean = false
  dataEvent: any = {
    data: [],
    next_page_url: null,
    total: 0
  }

  constructor(private router: Router, private route: ActivatedRoute, private navCtrl: NavController, private adminService: AdminEventService, private eventService: EventService, private toastCtrl: ToastController) { }

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
    if(currentCategory === "all") {
      this.activeAll = true
      this.activeApproved = false
      this.activeDeclined = false
      this.activeRequested = false
    } else if (currentCategory === "approved") {
      this.activeAll = false
      this.activeApproved = true
      this.activeDeclined = false
      this.activeRequested = false
    } else if (currentCategory === "declined") {
      this.activeAll = false
      this.activeApproved = false
      this.activeDeclined = true
      this.activeRequested = false
    } else {
      this.activeAll = false
      this.activeApproved = false
      this.activeDeclined = false
      this.activeRequested = true
    }
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
