import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import * as papa from 'papaparse';

@Component({
  selector: 'app-detail-form',
  templateUrl: './detail-form.page.html',
  styleUrls: ['./detail-form.page.scss'],
})
export class DetailFormPage implements OnInit {

form : any
headerRow = ["No.","Nama Pesakit","No. KP","Masalah Kesihatan","Hospital","Nama Pengiring","No. KP Pengiring","No. Tel Pengiring","Hubungan","Alamat Pesakit","Alamat Pengiring","Tarikh Form"]

constructor(private router: Router, private file: File, private toastController: ToastController, private alertCtrl: AlertController) { 
  this.form = this.router.getCurrentNavigation().extras.state.form
}

ngOnInit() {
  this.form = JSON.parse(this.form)
}

downloadCSV() {
  let csv = papa.unparse({
    fields: this.headerRow,
    data: [this.form.id, this.form.name, this.form.no_kp, this.form.health_issues,this.form.hospital, this.form.sender_list, this.form.sender_kp_no, this.form.sender_tel_no, this.form.relationship, this.form.sarawak_address, this.form.current_address, this.form.created_at]
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
  let fileName = `Maklumat Pesakit ${this.form.name}.csv`
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

}
