import { Component, OnInit } from '@angular/core';
import { AdminEventService } from '../../services/event/admin-event.service';
import { ToastController } from '@ionic/angular';
import { Chart } from 'chart.js'

interface Point {
  x: string
  y: number
}

interface EventResponseI {
  events: Array<Point>
  eventByCategory: Array<Point>
  eventByClass: Array<Point>
}

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
})

export class StatisticComponent implements OnInit {
  data: EventResponseI = {
    events: [],
    eventByCategory: [],
    eventByClass: []
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
      .get('all')
      .subscribe(
        (res: EventResponseI) => {
          this.data = res
          console.log(res)
        },
        err => this.popToast(
          'Something went wrong in getting list of events'
        )
      )
  }

  ngAfterContentChecked() {
    if (!this.chartInit) {
      const { events, eventByCategory, eventByClass } = this.data
      const canvas: NodeList = document.querySelectorAll('canvas')
      if (canvas.length && events.length &&
        eventByCategory.length &&
        eventByClass.length) {
        this.initChart()
        this.chartInit = true
      }
    }
  }

  extractData(point: Array<Point>) {
    return [
      point.map((m: Point) => m.x),
      point.map((m: Point) => m.y)
    ]
  }

  initChart() {
    const lineChart = document.querySelector('canvas#lineChart')
    const barChart = document.querySelector('canvas#barChart')
    const classChart = document.querySelector('canvas#classChart')
    const [month] = this.extractData(this.data.events)
    const [campaigns, campaignData] = this.extractData(this.data.eventByCategory)
    const [classNames, classData] = this.extractData(this.data.eventByClass)
    this.lineChart = new Chart(lineChart, {
      type: 'line',
      data: {
        labels: month,
        datasets: [{
          label: 'events',
          fill: true,
          data: this.data.events,
          backgroundColor: this.color.fill,
          pointBackgroundColor: this.color.stroke,
          borderColor: this.color.stroke,
          pointHighlightStroke: this.color.stroke,
          borderCapStyle: 'butt',
        }]
      },
      options: {
        responsive: true,
        // Can't just just `stacked: true` like the docs say
        scales: {
          yAxes: [{
            stacked: true,
          }]
        },
        animation: {
          duration: 750,
        },
      },
    })
    this.barChart = this.initNewBarChart(campaigns, campaignData, barChart, 'Created events by campaign')
    this.classChart = this.initNewBarChart(classNames, classData, classChart, 'Created events by category')
  }

  initNewBarChart(x: Array<string | number>, y: Array<number | string>, selector: Element, label: string) {
    console.log(y)
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
