import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as RSSParser from 'src/assets/js/rss-parser.min.js'

// declare var RSSParser

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  targetUrl : any = 'http://sarawakvoice.com/feed/'
  proxy : string = 'https://cors-anywhere.herokuapp.com/'
  entries : any = {
    title: '',
    description: '',
    items: []
  }
  loading: boolean = true
  parser = new RSSParser()

  constructor(private iab: InAppBrowser) {}

  async ngOnInit() {
    this.entries = await this.parser.parseURL(this.proxy + this.targetUrl)
    if(this.entries) {
      this.loading = false
    }
  }

  open(url) {
    this.iab.create(url,'_system')
  }

  doRefresh(event) {
    setTimeout(() => {
      this.parser.parseURL(this.proxy + this.targetUrl).then((data) => {
        this.entries = data
      })
      this.loading = false
      event.target.complete()
    }, 2000)
  }
}
