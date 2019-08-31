import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { Platform, IonRouterOutlet, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Plugins, Capacitor, DeviceInfo } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { OneSignal } from '@ionic-native/onesignal/ngx'
const { Device } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
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
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;


  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private oneSignal : OneSignal,
    private alertCtrl : AlertController
  ) {
    this.initializeApp();
    // Initialize BackButton Eevent.
    this.setAndroidBackButtonBehavior();
        // OneSignal Code start:
    // Enable to debug issues:
    // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

    if (this.platform.is('cordova')) {
      this.setupPush()
    }
  }

  setupPush () {
    this.oneSignal.startInit('424f25ed-3aa5-4388-a678-ebc0e02157bd', '31798403922')

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None)

    this.oneSignal.handleNotificationReceived().subscribe((data : any) => {
      let msg = data.payload.body
      let title = data.payload.title
      let additionalData = data.payload.additionaldata
      this.showAlert(title, msg, additionalData)
    })

    this.oneSignal.handleNotificationOpened().subscribe((data : any) => {
      let additionalData = data.notification.payload.additionalData
      this.showAlert('Notification opened', 'You already read this before', additionalData.task)
    })

    this.oneSignal.endInit()
  }

  async showAlert(title, msg, task) {
    const alert = await this.alertCtrl.create({
      header : title,
      subHeader : msg,
      buttons: [
        {
          text: `Okay`,
          handler: () => {
            console.log('Notified')
          }
        }
      ]
    })
    await alert.present()
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

  goToCampaign(campaign: string) {
    // localStorage.setItem('campaign', campaign)
    this.open = false;
    this.router.navigate(['/', 'admin', 'campaign', campaign])
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

  private async setAndroidBackButtonBehavior() {
    const deviceInfo = await Device.getInfo()
    if (deviceInfo.platform == "android") {
      this.platform.backButton.subscribe(() => {
        if (window.location.pathname == "/pages/home") {
          navigator['app'].exitApp();
        }
      });
    }
  }
}
