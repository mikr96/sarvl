import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {

  open: boolean = false
  open1: boolean = false

  constructor() { }

  ngOnInit() {
  }

}
