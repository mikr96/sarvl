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
  selection2 : boolean = false
  error: any

  constructor(private authService: AuthService, private loadingCtrl: LoadingController, private router: Router, private toastController: ToastController) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      address: new FormControl(null, {
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
      skills: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      volunteerbranch: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      occupation: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onSelect(event){
    if(event.detail.value.length > 2){
      let message = "Please use the skill sets not more than 2"
      this.popToast(message)
    }

    this.selection = true
}

  onSelect2(event){
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
      return this.popToast('Please fill in the form')
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
            if (!res) {
              return this.popToast('Something went wrong...')
            }
            this.registerForm.reset()
            this.router.navigate(['/','auth', 'register', 'verification'], {state: {item: this.registerForm.value.username}})
          }, (err : any) => {
            loadingEl.dismiss()
            this.error = Object.values(err.error)[0]
            return this.popToast(this.error)
          })
      });
  }
}
