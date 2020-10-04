import { Component, OnInit } from '@angular/core';
import { AdminEventService } from '../../services/event/admin-event.service';
import { ToastController } from '@ionic/angular';
import { URL } from '../../constants';
import { Chart } from 'chart.js'

// interface Point {
//   x: string
//   y: number
// }

interface EventResponseI {
  playstore: {
    id,
    click_counts,
    created_at,
    updated_at
  }
}

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {

  data : any = {
    playstore : []
  }
  lineChart: any
  barChart: any
  classChart: any
  chartInit: boolean = false
  color: { fill: string, stroke: string } = {
    fill: '#e0eadf',
    stroke: '#5eb84d',
  }

  constructor(private eventService: AdminEventService, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.eventService
      .getCounter()
      .subscribe(
        (res : EventResponseI) => {
          this.data = res
          // console.log(this.data)
        },
        err => this.popToast(
          'Something went wrong in getting list of events'
        )
      )
  }

  doRefresh(events) {
    setTimeout(()=> {
      this.eventService
      .getCounter()
      .subscribe(
        (res) => {
          this.data = res
          events.target.complete()
        },
        err => this.popToast(
          'Something went wrong in getting list of events'
        )
      )
    }, 2000)
  }

  ngAfterContentChecked() {
    if (!this.chartInit) {
      fetch(URL + 'playstore_click_counts').then(response => response.json()).then(data => {
        const playstore = data.playstore
        // console.log(playstore)
        // console.log(Object.keys(playstore).length)
        const canvas: NodeList = document.querySelectorAll('canvas')
        if (canvas.length && (Object.keys(playstore).length > 0 )) {
          this.initChart(playstore)
          this.chartInit = true
        }
      })
    }
  }

  initChart(data) {
    // const lineChart = document.querySelector('canvas#lineChart')
    // const [month] = this.extractData(this.data.events)
    // this.lineChart = new Chart(lineChart, {
    //   type: 'line',
    //   data: {
    //     labels: month,
    //     datasets: [{
    //       label: 'events',
    //       fill: true,
    //       data: this.data.events,
    //       backgroundColor: this.color.fill,
    //       pointBackgroundColor: this.color.stroke,
    //       borderColor: this.color.stroke,
    //       pointHighlightStroke: this.color.stroke,
    //       borderCapStyle: 'butt',
    //     }]
    //   },
    //   options: {
    //     responsive: true,
    //     // Can't just just `stacked: true` like the docs say
    //     scales: {
    //       yAxes: [{
    //         stacked: true,
    //       }]
    //     },
    //     animation: {
    //       duration: 750,
    //     },
    //   },
    // })
    const barChart = document.querySelector('canvas#barChartCounter')
    // console.log(this.data.playstore.click_counts)
    // const counter = this.data.playstore
    // console.log(data)
    this.classChart = this.initNewBarChart(['playstore', 'appstore'], [data.click_counts, '0'], barChart, 'Counter link click')
  }

  initNewBarChart(x: Array<string | number>, y: Array<number | string>, selector: Element, label: string) {
    return new Chart(selector, {
      type: 'bar',
      data: {
        labels: x,
        datasets: [{
          data: y,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          label
        }]
      }
    })
  }

  async popToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: 'danger',
    })

    toast.present()
  }

}
