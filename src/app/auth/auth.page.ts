import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { AuthService, AuthResponseData } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

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
  @ViewChild("password", { read: ElementRef, static: false } ) passwordElementRef: ElementRef;
  user : Observable<firebase.User>

  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private facebook: Facebook, private platform: Platform, private gplus : GooglePlus, private afAuth: AngularFireAuth) { 
    this.user = this.afAuth.authState
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

  loginWithFB() {
    this.facebook.login(['email', 'public_profile']).then((res : FacebookLoginResponse) => {
      this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)',[]).then(profile => {
        this.userData = {
          username: profile['email'],
          fullname: profile['name'],
          dp: profile['picture_large']['data']['url']
        }
      })
    })
  }

  async loginWithGoogle(): Promise<void> {
    try {
  
      const gplusUser = await this.gplus.login({
        'webClientId': 'your-webClientId-XYZ.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })
  
      // return await this.afAuth.auth.signInWithCredential(
      //   firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken))
  
    } catch(err) {
      console.log(err)
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
