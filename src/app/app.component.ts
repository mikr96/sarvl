import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Plugins, Capacitor } from '@capacitor/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  private authSub: Subscription;
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
    private authService: AuthService,
    private router: Router,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.authSub = this.authService.isAdmin.subscribe(isAdmin => this.isAdmin = isAdmin)
    this.authService.user.subscribe(o => {
      if (o && o.fullname)
        this.fullname = o.fullname
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
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

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
