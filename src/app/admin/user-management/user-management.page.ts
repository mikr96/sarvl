import { Component, OnInit } from '@angular/core';
import { AdminEventService } from 'src/app/services/event/admin-event.service';
import { Router } from '@angular/router';
import * as papa from 'papaparse';

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
  file : any
  csvData: any[] = [];
  headerRow = ["created_at", "created_by", "dp", "fullname", "ic", "id", "joined", "last_login", "location", "role", "skills", "telNo",  "updated_at", "updated_by", "username", "volunteered"]
  constructor(private adminEventService: AdminEventService, private router: Router) { }

  ngOnInit() {
    this.adminEventService.getUsers().subscribe((res:any) => {
      console.log(res)
      this.dataUser = res.users
    })
  }

  downloadCSV() {
    let csv = papa.unparse({
      fields: this.headerRow,
      data: this.dataUser.data
    });
 
    // Dummy implementation for Desktop download purpose
    var blob = new Blob([csv]);
    var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = "newdata.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
