import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import "@codetrix-studio/capacitor-google-auth";
import { AuthService, AuthResponseData } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController, Platform, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { FacebookLoginResponse } from '@rdlabo/capacitor-facebook-login';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
const { FacebookLogin } = Plugins;

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"]
})

export class AuthPage implements OnInit {
  form: FormGroup;
  token: any;
  status: boolean = true;
  password: any
  userData : any
  id : any
  accessToken : any
  user: Observable<firebase.User>;
  @ViewChild("password", { read: ElementRef, static: false } ) passwordElementRef: ElementRef;
  hasAccessTokenSubject: any;
  userRetrievedSuccessSubject: any;
  
  constructor(private modalCtrl: ModalController, private authService: AuthService, private router: Router, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private platform: Platform, private afAuth: AngularFireAuth,) {
    this.user = this.afAuth.authState;
  }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }
  
  async loginWithFB() {
    // this.whatabump();
    const FACEBOOK_PERMISSIONS = ['email'];
    const result = await <FacebookLoginResponse>FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    if (result.accessToken) {
      // Login successful.
      console.log(`Facebook access token is ${result.accessToken.token}`);
      this.authService.getID(result.accessToken.token).subscribe((res : any) => {
        let item = {
          id : res.id,
          access_token : result.accessToken.token
        }
        this.router.navigate(['/', 'auth', 'social'], {state: {item: JSON.stringify(item)}})
      })
    } else {
      // Cancelled by user.
    }
  }

  loginWithGoogle() {
    let data = this.googleSignIn()
  }

  async googleSignIn() {
    // this.whatabump()
    // let googleUser = await Plugins.GoogleAuth.signIn().catch(err => console.log(err));
    // if (googleUser) {
    //   const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
    //   console.log(credential)
    //   return this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);
    // }
  }

  async whatabump() {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      message: 'What a bump ! Sorry, please click register now.',
      buttons: ['OK']
    });

    await alert.present();
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Logging in...'
      })
      .then(loadingEl => {
        loadingEl.present();
        let auth: Observable<AuthResponseData>;
        auth = this.authService.login(this.form.value);
        auth.subscribe(
          res => {
            this.form.reset();
            loadingEl.dismiss();
            if (!res.isAdmin)
              this.router.navigateByUrl('/pages');
            else
              this.router.navigateByUrl('/admin')
          },
          err => {
            console.log(err);
            let message = 'Could not log in, please try again.';
            err.status== 401 ? this.router.navigate(['/', 'auth' , 'register', 'verification'], {state: {item: this.form.value.username}}) :
            err.status== 400 ? this.showAlert(message) : ''
            this.form.reset();
            loadingEl.dismiss();
          }
        );
      });
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  public hideShow(state : string) {
    if (state == 'hide') {
      this.status = true
      this.passwordElementRef.nativeElement.type = "password"
    } else if (state == 'show') {
      this.status = false
      this.passwordElementRef.nativeElement.type = "text"
    }
  }

  async resetPass() {
    const modal = await this.modalCtrl.create({
      component: ForgotPasswordComponent,
      componentProps: {
        id: this.id
      }
    });
    return await modal.present();
  }
}
