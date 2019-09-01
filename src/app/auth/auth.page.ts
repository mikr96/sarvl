import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import "@codetrix-studio/capacitor-google-auth";
import { AuthService, AuthResponseData } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { FacebookLoginResponse } from '@rdlabo/capacitor-facebook-login';
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
  user: Observable<firebase.User>;
  @ViewChild("password", { read: ElementRef, static: false } ) passwordElementRef: ElementRef;
  hasAccessTokenSubject: any;
  userRetrievedSuccessSubject: any;
  
  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private platform: Platform, private afAuth: AngularFireAuth,) {
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
    const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender'];
    const result = await <FacebookLoginResponse>FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    if (result.accessToken) {
      // Login successful.
      console.log(`Facebook access token is ${result.accessToken.token}`);
      console.log(result)
    } else {
      // Cancelled by user.
    }
  }

  loginWithGoogle() {
    let data = this.googleSignIn()
    console.log(data)
  }

  async googleSignIn() {
    let googleUser = await Plugins.GoogleAuth.signIn().catch(err => console.log(err));
    if (googleUser) {
      console.log(googleUser)
      const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
      return this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);
    }
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
            this.form.reset();
            loadingEl.dismiss();
            let message = 'Could not log in, please try again.';
            this.showAlert(message);
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
}
