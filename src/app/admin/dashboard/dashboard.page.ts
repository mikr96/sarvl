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
  events: Array<{ campaign: string, value: number }>
  @ViewChild('heartCanvas', {static: true}) heartCanvas;
  @ViewChild('collabCanvas', {static: false}) collabCanvas
  heartChart: any
  collabChart: any

  constructor(private eventService: AdminEventService, private toastCtrl: ToastController) {}

  ngOnInit() {
    // this.eventService
    //   .get('all')
    //   .subscribe(
    //     (res: EventResponseI) => {
    //       this.events = res.events
    //       this.initChart()
    //     },
    //     err => this.popToast(
    //       'Something went wrong in getting list of events'
    //     )
    //   )
    }

    // initChart () {
    //   //Called after ngOnInit when the component's or directive's content has been initialized.
    //   //Add 'implements AfterContentInit' to the class.
    //   // let all = document.querySelectorAll('canvas')
    //   // console.log(this.heartCanvas.nativeElement)
    //   this.heartChart = new Chart(this.heartCanvas.nativeElement, {
    //     type: 'bar',
    //     data: {
    //       labels: ['BJP', 'INC', 'AAP', 'CPI', 'CPI-M', 'NCP'],
    //       datasets: [{
    //         label: '# of Votes',
    //         data: [200, 50, 30, 15, 20, 34],
    //         backgroundColor: [
    //           'rgba(255, 99, 132, 0.2)',
    //           'rgba(54, 162, 235, 0.2)',
    //           'rgba(255, 206, 86, 0.2)',
    //           'rgba(75, 192, 192, 0.2)',
    //           'rgba(153, 102, 255, 0.2)',
    //           'rgba(255, 159, 64, 0.2)'
    //         ],
    //         borderColor: [
    //           'rgba(255,99,132,1)',
    //           'rgba(54, 162, 235, 1)',
    //           'rgba(255, 206, 86, 1)',
    //           'rgba(75, 192, 192, 1)',
    //           'rgba(153, 102, 255, 1)',
    //           'rgba(255, 159, 64, 1)'
    //         ],
    //         borderWidth: 1
    //       }]
    //     },
    //     options: {
    //       scales: {
    //         yAxes: [{
    //           ticks: {
    //             beginAtZero: true
    //           }
    //         }]
    //       }
    //     }
    //   })
    //   this.collabChart = new Chart(this.collabCanvas.nativeElement, {
    //     type: 'bar',
    //     data: {
    //       labels: ['BJP', 'INC', 'AAP', 'CPI', 'CPI-M', 'NCP'],
    //       datasets: [{
    //         label: '# of Votes',
    //         data: [200, 50, 30, 15, 20, 34],
    //         backgroundColor: [
    //           'rgba(255, 99, 132, 0.2)',
    //           'rgba(54, 162, 235, 0.2)',
    //           'rgba(255, 206, 86, 0.2)',
    //           'rgba(75, 192, 192, 0.2)',
    //           'rgba(153, 102, 255, 0.2)',
    //           'rgba(255, 159, 64, 0.2)'
    //         ],
    //         borderColor: [
    //           'rgba(255,99,132,1)',
    //           'rgba(54, 162, 235, 1)',
    //           'rgba(255, 206, 86, 1)',
    //           'rgba(75, 192, 192, 1)',
    //           'rgba(153, 102, 255, 1)',
    //           'rgba(255, 159, 64, 1)'
    //         ],
    //         borderWidth: 1
    //       }]
    //     },
    //     options: {
    //       scales: {
    //         yAxes: [{
    //           ticks: {
    //             beginAtZero: true
    //           }
    //         }]
    //       }
    //     }
    //   })
    //   // document.querySelectorAll('canvas').forEach((canvas: HTMLCanvasElement) => {
    //   //   this.heartCanvas = new Chart(canvas, {
    //   //     type: 'bar',
    //   //     data: {
    //   //       labels: ['BJP', 'INC', 'AAP', 'CPI', 'CPI-M', 'NCP'],
    //   //       datasets: [{
    //   //         label: '# of Votes',
    //   //         data: [200, 50, 30, 15, 20, 34],
    //   //         backgroundColor: [
    //   //           'rgba(255, 99, 132, 0.2)',
    //   //           'rgba(54, 162, 235, 0.2)',
    //   //           'rgba(255, 206, 86, 0.2)',
    //   //           'rgba(75, 192, 192, 0.2)',
    //   //           'rgba(153, 102, 255, 0.2)',
    //   //           'rgba(255, 159, 64, 0.2)'
    //   //         ],
    //   //         borderColor: [
    //   //           'rgba(255,99,132,1)',
    //   //           'rgba(54, 162, 235, 1)',
    //   //           'rgba(255, 206, 86, 1)',
    //   //           'rgba(75, 192, 192, 1)',
    //   //           'rgba(153, 102, 255, 1)',
    //   //           'rgba(255, 159, 64, 1)'
    //   //         ],
    //   //         borderWidth: 1
    //   //       }]
    //   //     },
    //   //     options: {
    //   //       scales: {
    //   //         yAxes: [{
    //   //           ticks: {
    //   //             beginAtZero: true
    //   //           }
    //   //         }]
    //   //       }
    //   //     }
    //   //   })
    //   // })
    // }

    // async popToast(message: string) {
    //   const toast = await this.toastCtrl.create({
    //     message,
    //     duration: 2000,
    //     color: 'danger',
    //   })
  
    //   toast.present()
    // }
  }