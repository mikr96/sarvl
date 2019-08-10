import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup

  constructor(private authService: AuthService, private loadingCtrl: LoadingController, private router: Router) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      confirmPassword: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      fullname: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      ic: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onSubmit() {
    if(!this.registerForm.valid) {
      return;
    }

    console.log(this.registerForm.value)

    this.loadingCtrl
    .create({
      message: 'Registering...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.authService
        .createAcc(this.registerForm.value)
        .subscribe(res => {
          console.log(res)
          // if(res.token) {
          //   loadingEl.dismiss();
          //   this.registerForm.reset();
          //   this.router.navigate(['/auth']);
          // }
        });
    });
  }
}
