import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup

  constructor(private authService: AuthService, private loadingCtrl: LoadingController, private router: Router, private toastController: ToastController) { }

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

  async popToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'danger',
    })
    toast.present()
  }

  onSubmit() {
    if (!this.registerForm.valid) {
      return;
    }

    this.loadingCtrl
      .create({
        message: 'Registering...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.authService
          .createAcc(this.registerForm.value)
          .subscribe(res => {
            loadingEl.dismiss()
            if (!res.user) {
              return this.popToast('Something went wrong...')
            }
            this.registerForm.reset()
            this.router.navigate(['/auth'])
          }, ({ error }) => {
            const firstError: string = Object.values(error)[0][0]
            loadingEl.dismiss()
            return this.popToast(firstError)

          })
      });
  }
}
