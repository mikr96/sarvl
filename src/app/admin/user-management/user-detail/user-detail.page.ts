import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  user : any
  constructor(private router: Router) { 
    this.user = this.router.getCurrentNavigation().extras.state.user
  }

  ngOnInit() {
    this.user = JSON.parse(this.user)
  }

}
