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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  goToCategory(category: string){
    //plugin.storage
    localStorage.setItem('category', category)
    this.open = false;
    this.router.navigate(['/', 'pages', 'category', category])
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
