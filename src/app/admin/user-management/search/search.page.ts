import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  user : any = {
    data : []
  }
  userData : any = []
  isItemAvailable: boolean = false
  constructor(private router: Router) { 
    this.user = this.router.getCurrentNavigation().extras.state.user
  }

  ngOnInit() {
    this.user = JSON.parse(this.user)
    this.userData = this.user.data.map(user => {
      return user
    })
    console.log(this.userData)
    this.isItemAvailable = true;
  }
  
  initializeItems() { 
    this.userData = this.user.data.map(user => {
      return user
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
      this.userData = this.userData.filter((item) => {
        return (item.username.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  viewMore(user) {
    this.router.navigate(['/', 'admin', 'user-management', 'user-detail'], {state: {user: JSON.stringify(user)}})
  }

}
