import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup
  selection : boolean = false

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
      password_confirmation: new FormControl(null, {
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
      }),
      telNo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      location: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      skillset: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
  }

  onSelect(event){
    if(event.detail.value.length > 2){
      let message = "Please use the skill sets not more than 2"
      this.popToast(message)
    }

    this.selection = true
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
            loadingEl.dismiss()
            if (!res) {
              return this.popToast('Something went wrong...')
            }
            this.registerForm.reset()
            this.router.navigateByUrl('/auth')
          }, ({ error }) => {
            const firstError: string = Object.values(error)[0][0]
            loadingEl.dismiss()
            return this.popToast(firstError)
          })
      });
  }
}
