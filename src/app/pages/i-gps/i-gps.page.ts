import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { URL } from '../../constants';

@Component({
  selector: 'app-i-gps',
  templateUrl: './i-gps.page.html',
  styleUrls: ['./i-gps.page.scss'],
})
export class IGPSPage implements OnInit {

  constructor(private iab: InAppBrowser) {}

  ngOnInit() {
  }

  onApply(){
    this.iab.create('http://175.138.68.197:51/iWPS/Account/UserLogin.aspx','_system')
  }

  onPlayStore(){
    fetch(URL + 'playstore_click_counts', { method: 'PATCH' }).then(()=> {
      this.iab.create('https://play.google.com/store/apps/details?id=com.baxter.myapp&hl=en','_system')
    })
  }

}
