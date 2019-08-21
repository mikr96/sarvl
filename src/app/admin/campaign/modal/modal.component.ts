import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  image: any
  title: any
  description: any 
  start_date: any
  end_date: any
  goal: any
  comments: any 
  location: any
  view_count: any
  noVolunteers: any
  volunteered: any
  whatsapp_link: any
  campaign: any
  constructor(private navParams: NavParams, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.image = this.navParams.get('image')
    this.title = this.navParams.get('title')
    this.description = this.navParams.get('description')
    this.start_date = this.navParams.get('start_date')
    this.start_date = this.start_date.split(" ");
    this.start_date = this.start_date[0]
    this.end_date = this.navParams.get('end_date')
    this.end_date = this.end_date.split(" ");
    this.end_date = this.end_date[0]
    this.goal = this.navParams.get('goal')
    this.comments = this.navParams.get('comments')
    this.location = this.navParams.get('location')
    this.view_count = this.navParams.get('view_count')
    this.noVolunteers = this.navParams.get('noVolunteers')
    this.volunteered = this.navParams.get('volunteered')
    this.whatsapp_link = this.navParams.get('whatsapp_link')
    this.campaign = this.navParams.get('campaign')
  }

  dismissModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
