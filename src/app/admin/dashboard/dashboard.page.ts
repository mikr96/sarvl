import { Component, OnInit, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { EventService } from 'src/app/services/event/event.service';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
const { Storage } = Plugins

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit {
  name: any;


  constructor(private eventService: EventService, private toastCtrl: ToastController, private router: Router) {
    this.checkRole()
  }

  async checkRole(){
    const ret = await Storage.get({ key: 'role' });
    let role = ret.value;
    if(role === "volunteer") {
      this.router.navigateByUrl('/pages')
    }
  }

  ngOnInit() {
    this.setFullname()
  }

  async setFullname() {
    try {
      const ret = await Storage.get({ key: 'fullname' });
      this.name = ret.value;
      this.eventService.setFullname(this.name);
    } catch (err) {
      console.log(err)
    }
  }
  
}