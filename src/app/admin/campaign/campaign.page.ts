import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AdminEventService } from 'src/app/services/event/admin-event.service';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.page.html',
  styleUrls: ['./campaign.page.scss'],
})
export class CampaignPage implements OnInit {

  isLoading: boolean = false;
  currentCampaign: any
  activeAll: boolean = true
  activeApproved: boolean = false
  activeDeclined: boolean = false
  activeRequested: boolean = false

  constructor(private router: Router, private route: ActivatedRoute, private navCtrl: NavController, private adminService: AdminEventService) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/pages/home');
        return;
      }
      this.currentCampaign = paramMap.get('id');
      // this.adminService
      // .getEventByCampaign(this.currentCampaign)
      // .subscribe(
      //   (event: any) => {
      //     this.isLoading = false;
      //     this.dataEvent = event.events;
      //   },
      //   error => {
      //     this.handleError(error)
      //   }
      // );
    })
  }

  changeCategory(currentCategory) {
    //console.log(currentCategory)
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

}
