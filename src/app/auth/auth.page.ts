import { Component, OnInit } from "@angular/core";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"]
})

export class AuthPage implements OnInit {

  form: FormGroup;
  token: any;

  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(6)]
      })
    });
  }

  onSubmit() {
    this.authService.authenticated();
    this.router.navigate(['/pages']);

    /* After testing baru uncomment */
    // if(!this.form.valid) {
    //   return;
    // }
    // this.loadingCtrl
    // .create({
    //   message: 'Logging in...'
    // })
    // .then(loadingEl => {
    //   loadingEl.present();
    //   this.authService
    //     .login(this.form.value)
    //     .subscribe(res => {
    //       if(res) {
    //         loadingEl.dismiss();
    //         this.form.reset();
    //         this.authService.authenticated();
    //         this.router.navigate(['/pages']);
    //       }
    //     });
    // });

  }
}
