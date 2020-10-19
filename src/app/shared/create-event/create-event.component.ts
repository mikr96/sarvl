import { Component, OnInit, ErrorHandler } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/event/event.service';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Plugins } from '@capacitor/core';
import { AuthService } from '../../services/auth.service';
const { Storage } = Plugins

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent {

  eventForm: FormGroup
  imageFile : any = [];
  PdfFile : any
  returnPath: string;
  pdf : any
  path: any;
  err: any;
  message: any;
  testResponse: any;
  fd: any;
  nativepath: any;
  file_name: any = "Proposal (PDF)"
  status: boolean = false
  token: any
  fileTransfer : FileTransferObject = this.transfer.create();
  pdfURL : any
  
  constructor(private eventService: EventService, private loadingCtrl: LoadingController, private router: Router, private toastController: ToastController, private fileChooser: FileChooser, private filePath: FilePath, private transfer: FileTransfer, private base64: Base64, private file: File, private authService: AuthService, private platform: Platform) {
    this.eventForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      start_date: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      end_date: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      location: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      campaign: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      goal: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      images: new FormControl(null),
      noVolunteers: new FormControl(null, {
        updateOn: 'blur'
      }),
      // proposal: new FormControl(null, {
      //   updateOn: 'blur',
      //   validators: [Validators.required]
      // })
    });
  }
  
  onFilePicked (event : any) {
     const pickedFile = (event.target as HTMLInputElement).files[0];
     if (!pickedFile) {
       return;
     }
     const fr = new FileReader();
     fr.onload = () => {
       const dataUrl = fr.result.toString();
       console.log(dataUrl)
       Storage.set({ key: 'dataUrl', value: dataUrl})
       this.base64.encodeFile(dataUrl).then((base64File: string) => {
        console.log(base64File);
        Storage.set({ key: 'base64File', value: base64File})
        this.eventForm.patchValue({ proposal: base64File });
      }, (err) => {
        console.log(err);
      });
     };
     fr.readAsDataURL(pickedFile);
   }

  onImagePicked(imageData: string | File) {
    if (typeof imageData === 'string') {
      try {
        this.imageFile.push(imageData)
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      this.imageFile.push(imageData)
    }
    this.eventForm.patchValue({ images: this.imageFile });
  }

  getFileInfo(): Promise<any> {
    return this.fileChooser.open().then(fileURI => {
        return this.filePath.resolveNativePath(fileURI).then(filePathUrl => {
            return this.file
                .resolveLocalFilesystemUrl(fileURI)
                .then((fileEntry: any) => {
                    return new Promise((resolve, reject) => {
                        fileEntry.file(
                            meta =>
                                resolve({
                                    nativeURL: fileEntry.nativeURL,
                                    fileNameFromPath: filePathUrl.substring(filePathUrl.lastIndexOf('/') + 1),
                                    ...meta,
                                }),
                            error => reject(error)
                        );
                    });
                });
        });
    });
}

uploadFile(fileMeta, url, uploadUrl, token) {

  const options: FileUploadOptions = {
    fileKey: 'file',
    fileName: fileMeta.fileNameFromPath,
    headers: {
      'Content-Length' : fileMeta.size,
      'Authorization' : 'Bearer ' + token,
      'Accept': 'application/json'
    },
    httpMethod: 'POST',
    mimeType: fileMeta.type,
  };

  console.log(fileMeta)
  console.log("Filemeta: " + JSON.stringify(fileMeta, null, 2))

  this.file_name = fileMeta.fileNameFromPath

  const fileTransfer: FileTransferObject = this.transfer.create();
  return fileTransfer.upload(url, uploadUrl, options);
}

async selectAFile() {
  this.token = await Storage.get({ key: 'authData' });
  const userData = JSON.parse(this.token.value) as {
    token: string;
    isAdmin: boolean;
    user_id: string;
  };

  const uploadUrl = encodeURI("http://sarvl.my.to/pdf")
  // const uploadUrl = encodeURI("http://sarwkapps.myddns.me/pdf")

  this.loadingCtrl
    .create({
      message: 'Uploading...'
    }).then(loadingEl => {
      loadingEl.present()
      if (this.platform.is('android')) {
        this.fileChooser.open()
          .then(
            uri => {
              this.filePath.resolveNativePath(uri)
                .then(url => {
                  console.log("URL: " + url)
                  this.getFileInfo()
                  .then(async fileMeta => {

                      const response = await this.uploadFile(
                        fileMeta,
                        url,
                        uploadUrl,
                        userData.token
                    );

                    if(response) {
                      console.log("Success: " + JSON.stringify(response, null, 2))
                      console.log("Success: " + response)
                      this.pdf = JSON.parse(response.response).file
                      console.log("File: " + JSON.parse(response.response).file)
                      this.status = true
                      loadingEl.dismiss()
                    } else {
                      //upload error message
                      console.log("Error: " + JSON.stringify(response, null, 2))
                      console.log("Error: " + response)
                      this.status = false
                      loadingEl.dismiss()
                      this.popToast("Fail upload. Please try again.")
                    }
                  })
                  .catch(error => {
                      //something wrong with getting file infomation
                      console.log("Error getfileinfo: " + JSON.stringify(error, null, 2))
                      console.log("Error getfileinfo: " + error)
                  });
                })
                .catch(err => console.log(err));
            }
          )
          .catch(error => {
            console.log(error)
          });
      }
  })
}
  
async onSubmit() {
  if (!this.eventForm.valid) {
    return this.popToast('Please fill in the form')
  }

  // if (!this.pdf) {
  //   return this.popToast('Please upload proposal')
  // }

  this.loadingCtrl
    .create({
      message: 'Creating...'
    })
    .then(loadingEl => {
      loadingEl.present();
      return this.eventService.createEvent(
        this.eventForm.value.title,
        new Date(this.eventForm.value.start_date),
        new Date(this.eventForm.value.end_date),
        this.eventForm.value.location,
        this.eventForm.value.campaign,
        this.eventForm.value.goal,
        this.eventForm.value.description,
        this.eventForm.value.images,
        this.eventForm.value.noVolunteers,
        this.pdf
      )
        .subscribe(
          res => {
            console.log(this.eventForm.value)
            loadingEl.dismiss()
            this.eventForm.reset()
            this.router.navigate(['/pages/home'])
          },
          err => {
            console.log(err)
            const firstError: any = Object.values(err)[0]
            loadingEl.dismiss()
            this.popToast(firstError)
          })
    });
  }

  async popToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: 'danger',
    })
    toast.present()
  }
}
