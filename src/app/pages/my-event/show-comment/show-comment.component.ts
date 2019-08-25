import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { EventService } from 'src/app/services/event/event.service';

@Component({
  selector: 'app-show-comment',
  templateUrl: './show-comment.component.html',
  styleUrls: ['./show-comment.component.scss'],
})
export class ShowCommentComponent implements OnInit {
  comments: any
  item: any
  constructor(private modalCtrl: ModalController, private navParams: NavParams, private eventService: EventService) { }

  ngOnInit() {
    this.comments = this.navParams.get('comments')
    this.comments = JSON.parse(this.comments)
    console.log(this.comments)
  }

  dismissModal(){
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
