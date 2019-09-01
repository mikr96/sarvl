import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
const { Storage } = Plugins

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  events: any
  items: any  
  titles: any
  isItemAvailable : boolean = false; // initialize the items with false

  constructor(private router: Router) { }

  ngOnInit() {
    this.getObject()
  }

  async getObject() {
    const ret = await Storage.get({ key: 'items' });
    this.events = JSON.parse(ret.value);
    this.items = this.events.data
    this.isItemAvailable = true;
  }

  
  initializeItems() { 
    this.items = this.events.data; 
  }

  
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.isItemAvailable = true;
      this.items = this.items.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  goToDetails(item) {
    this.router.navigate(['/', 'pages', 'detail-event'], {state: {item: JSON.stringify(item)}})
  }
  
}
