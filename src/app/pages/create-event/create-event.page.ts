import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {

  constructor(private location: Location) {
  }

  ngOnInit() {
  }


goBack() {
    this.location.back();
  }
}
