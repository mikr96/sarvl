import { Component, OnInit } from '@angular/core';
import { AdminEventService } from 'src/app/services/event/admin-event.service';
import { Router } from '@angular/router';
import * as papa from 'papaparse';
import { File } from '@ionic-native/file/ngx';
import { ToastController, AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { EventService } from 'src/app/services/event/event.service';
const { Storage } = Plugins

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
  csvData: any[] = [];
  headerRow = ["created_at", "created_by", "dp", "fullname", "ic", "id", "joined", "last_login", "location", "role", "skills", "telNo",  "updated_at", "updated_by", "username", "volunteered"]
  name: string;
  constructor(private adminEventService: AdminEventService, private router: Router, private file: File, private toastController: ToastController, private alertCtrl: AlertController, private eventService: EventService) { }

  ngOnInit() {
    this.adminEventService.getUsers().subscribe((res:any) => {
      this.dataUser = res.users
      this.setFullname()
    })
  }
  
  async setFullname() {
    try {
      const ret = await Storage.get({ key: 'fullname' });
      this.name = ret.value;
      this.eventService.setFullname(this.name);
    } catch (err) {
      console.log(err)
    }
  }
  
  downloadCSV() {
    let csv = papa.unparse({
      fields: this.headerRow,
      data: this.dataUser.data
    });
    var blob = new Blob([csv]);
 
    // Dummy implementation for Desktop download purpose
    // var blob = new Blob([csv]);
    // var a = window.document.createElement("a");
    // a.href = window.URL.createObjectURL(blob);
    // a.download = "newdata.csv";
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    this.saveFile(blob)
  }

  async saveFile(body) {
    let fileName = "newdata.csv"
    try {
      const data = await this.file.writeFile(this.file.externalRootDirectory, fileName, body, { replace : true })
      const res = await data
      this.showAlert(`Your may find your file at ${this.file.externalRootDirectory}`)
    } catch (err) {
      this.popToast(err)
      console.log(err)
      try {
        const file = await this.file.writeExistingFile(this.file.externalRootDirectory, fileName, body)
        const existing = await file
        this.showAlert(`Your existing file has been overwrite at ${this.file.externalRootDirectory}`)
      } catch (err) {
        console.log(err)
        this.popToast(err)
      }
    }
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'User Management',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  private async popToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'danger',
    })
    toast.present()
  }
  

  doRefresh(event) {
    setTimeout(()=> {
      this.adminEventService.getUsers().subscribe((res:any) => {
        this.dataUser = res.users
        event.target.complete()
      })
    }, 2000)
  }

  viewMore(user) {
    this.router.navigate(['/', 'admin', 'user-management', 'user-detail'], {state: {user: JSON.stringify(user)}})
  }

}
