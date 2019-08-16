import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  open = false;
  submenu = [
    {
      title: 'Heart',
      category: '(Programs)'
    },
    {
      title: 'Collab',
      category: '(Events)'
    },
    {
      title: 'Touch',
      category: '(Donations)'
    },
    {
      title: 'Cradle',
      category: '(Workshops)'
    },
    {
      title: 'Belief',
      category: '(Causes)'
    },
  ];
  isAdmin: boolean = false
  fullname: string = ''

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.authService.isAdmin.subscribe(isAdmin => this.isAdmin = isAdmin)
    this.authService.user.subscribe(o => {
      if (o && o.fullname)
        this.fullname = o.fullname
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  goToCategory(category) {
    //plugin.storage
    localStorage.removeItem('category')
    localStorage.setItem('category', category)
    this.router.navigateByUrl('/pages/category');
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
