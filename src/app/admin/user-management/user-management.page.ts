import { Component, OnInit } from '@angular/core';
import { AdminEventService } from 'src/app/services/event/admin-event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
})
export class UserManagementPage implements OnInit {
  dataUser: any = {
    data: [],
    next_page_url: null,
    total: 0
  }
  constructor(private adminEventService: AdminEventService, private router: Router) { }

  ngOnInit() {
    this.adminEventService.getUsers().subscribe((res:any) => {
      console.log(res)
      this.dataUser = res.users
    })
  }

  doRefresh(event) {
    setTimeout(()=> {
      this.adminEventService.getUsers().subscribe((res:any) => {
        console.log(res)
        this.dataUser = res.users
        event.target.complete()
      })
    }, 2000)
  }

  viewMore(user) {
    console.log(user)
    this.router.navigate(['/', 'admin', 'user-management', 'user-detail'], {state: {user: JSON.stringify(user)}})
  }

}
