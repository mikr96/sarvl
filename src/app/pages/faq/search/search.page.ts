import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  faq : any
  questions : any = []
  isItemAvailable: boolean = false
  constructor(private router: Router) { 
    this.faq = this.router.getCurrentNavigation().extras.state.faq
  }

  ngOnInit() {
    this.faq = JSON.parse(this.faq)
    this.questions = this.faq.faqs.map(data => {
      return data.questions
    })
    this.isItemAvailable = true;
  }
  
  initializeItems() { 
    this.questions = this.faq.faqs.map(data => {
      return data.questions
    })
  }

  
  getItems(ev: any) {
    // // Reset items back to all of the items
    this.initializeItems();

    // // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.isItemAvailable = true;
      this.questions = this.questions.filter((item) => {
        return (item.question.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}
