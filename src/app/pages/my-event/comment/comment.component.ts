import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { EventService } from 'src/app/services/event/event.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  id: any
  remark: any 
  
  constructor(private modalCtrl: ModalController, private navParams: NavParams, private eventService: EventService) { }

  ngOnInit() {
    this.remark = this.navParams.get('remark')
  }

  dismissModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
