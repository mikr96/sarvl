import { Component, OnInit } from "@angular/core";
import { AuthService, AuthResponseData } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"]
})

export class AuthPage implements OnInit {

  form: FormGroup;
  token: any;

  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onSubmit() {
    if(!this.form.valid) {
      return;
    }
    this.loadingCtrl
    .create({
      keyboardClose: true,
      message: 'Logging in...'
    })
    .then(loadingEl => {
      loadingEl.present();
      let auth : Observable<AuthResponseData>;
      auth = this.authService.login(this.form.value);
      auth.subscribe(
        res => {
          console.log(res)
          this.form.reset();
          loadingEl.dismiss();
          this.router.navigateByUrl('/pages');
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
}
