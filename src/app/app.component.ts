import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { Platform, IonRouterOutlet, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Plugins, Capacitor, DeviceInfo } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { OneSignal } from '@ionic-native/onesignal/ngx'
import { async } from '@angular/core/testing';
import { EventService } from './services/event/event.service';
const { Device, Storage } = Plugins;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  private authSub: Subscription;
  open = false;
  open2 = false;
  submenu = [
    {
      title: 'Heart',
      category: '(Programs)'
    },
    {
      title: 'Relief',
      category: '(Causes)'
    }
  ];
  submissionSubMenu = [
    {
      title: 'My Event'
    },
    {
      title: 'iGPS',
      category: '(Student)'
    },
    {
      title: 'Welfare & Medical'
    }
  ];
  submenuadmin = [
    {
      title: 'Heart',
      category: '(Programs)'
    },
    {
      title: 'Relief',
      category: '(Causes)'
    },
    {
      title: 'iGPS',
      category: '(Student)'
    },
    {
      title: 'Welfare & Medical'
    }
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
    private alertCtrl : AlertController,
    private actionSheetController: ActionSheetController,
    private eventService: EventService
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
      Storage.set({ key: 'fullname', value: o.fullname})
    })
    this.eventService.fullname$.subscribe(res => {
      this.fullname = res;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  // user punya
  goToCategory(category: string){
    //plugin.storage
    localStorage.setItem('category', category)
    this.open = false;
    this.router.navigate(['/', 'pages', 'category', category])
  }

  // user punya
  goToSubmission(submission: string){
    //plugin.storage
    localStorage.setItem('submission', submission)
    this.open = false;
    (submission == "Welfare & Medical") ? submission = "welfare-assistant" : submission;
    (submission == "My Event") ? submission = "my-event" : submission;
    this.router.navigate(['/', 'pages', submission])
  }
  

  // admin punya
  goToCampaign(campaign: string) {
    // localStorage.setItem('campaign', campaign)
    this.open = false;
    (campaign == "Welfare & Medical") ? campaign = "welfare-assistant" : campaign
    if(campaign=="welfare-assistant" || campaign=="iGPS") {
      this.router.navigate(['/', 'admin', campaign])
    } else {
      this.router.navigate(['/', 'admin', 'campaign', campaign])
    }
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
      this.platform.backButton.subscribe(async () => {
        if (window.location.pathname == "/pages/home") {
          const actionSheet = await this.alertCtrl.create({
            header: 'Sarawak Volunteer',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Exit App',
                handler: () => {
                  navigator['app'].exitApp();
                }
              }
            ]}
          );
          await actionSheet.present();
        }
      });
    }
  }
}
