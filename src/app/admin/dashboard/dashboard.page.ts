import { Component, OnInit, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { AdminEventService } from '../../services/event/admin-event.service';
import { ToastController } from '@ionic/angular';
import { Chart } from 'chart.js'

interface EventResponseI {
  events: [
    { campaign: string, value: number }
  ]
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit {


  constructor(private eventService: AdminEventService, private toastCtrl: ToastController) {}

  ngOnInit() {}
  }