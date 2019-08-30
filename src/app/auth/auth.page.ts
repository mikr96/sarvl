import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { AuthService, AuthResponseData } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

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
  @ViewChild("password", { read: ElementRef, static: false } ) passwordElementRef: ElementRef;

  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

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
