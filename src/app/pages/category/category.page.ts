import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event/event.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  category: string = ''
  id: string
  isLoading = false
  dataEvent: any = {
    data: [],
    next_page_url: null,
    total: 0
  }
  img: boolean;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    // this.category = localStorage.getItem('category');
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/pages/home');
        return;
      }
      this.id = paramMap.get('id');
      this.isLoading = true;
      this.eventService
      .getEventByCategory(this.id)
      .subscribe(
        (event: any) => {
          this.isLoading = false;
          this.dataEvent = event.events;
        },
        error => {
          this.alertCtrl
            .create({
              header: 'An error occurred!',
              message: 'Event could not be fetched. Please try again later.',
              buttons: [
                {
                  text: 'Okay'
                }
              ]
            })
            .then(alertEl => {
              alertEl.present();
            });
        }
      );
    })
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

  changeCategory(value) {
    this.eventService.getEventByCampaign(value).subscribe(res => {
      console.log(res)
    })
  }

}
