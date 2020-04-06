import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Camera, PictureSourceType, CameraOptions, DestinationType } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage'
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { FileChooser, FileChooserOptions } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { Tab1Service } from '../tab1/tab1.service';

const STORAGE_KEY = 'property_imgs';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss'],
})
export class AddPropertyComponent implements OnInit {

  imageArray = [];
  imageName = [];
  error;
  images = [];
  routeSub: Subscription;
  propertyId = null;
  propertyDetails;
  propertyImages = [];
  propertyDocuments = [];
  properyName;
  properyDesc;
  properyRegion;
  propertyDocArr;

  constructor(
    private imagePicker: ImagePicker,
    private file: File,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private storage: Storage,
    private webView: WebView,
    private toastController: ToastController,
    private ref: ChangeDetectorRef,
    private plt: Platform,
    private domSanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private tab1Service: Tab1Service,
    private previewAnyFile: PreviewAnyFile,
    private router: Router,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private base64: Base64,
    private androidPermissions: AndroidPermissions
  ) { }

  ngOnInit() {
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      this.propertyId = params.id;

      if (this.propertyId) {
        this.getPropertyDetails();
      }
    });

    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(res => { console.log(res) })
      .catch(err => { console.log(err) });

    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    //   .then(res => {
    //     if (!res) {
    //     }
    //   })
    //   .catch(err => { });

    this.imagePicker.hasReadPermission()
      .then((res) => {
        if (!res) {
          this.imagePicker.requestReadPermission();
        }
      });

    this.plt.ready()
      .then(() => {
        this.loadStoredImages();
      });
  }

  getPropertyDetails(): void {
    this.tab1Service.getPropertyById(this.propertyId).subscribe(response => {
      this.propertyDetails = response.data;
      this.properyName = this.propertyDetails.propertyName;
      this.properyDesc = this.propertyDetails.propertyDescription;
      this.properyRegion = this.propertyDetails.propertyRegion;

      if (response.data.propertyExtraInfo && response.data.propertyExtraInfo.images) {
        this.propertyImages = response.data.propertyExtraInfo.images;
      }
      if (response.data.propertyExtraInfo && response.data.propertyExtraInfo.documents) {
        this.propertyDocuments = response.data.propertyExtraInfo.documents;
      }
    });
  }

  selectDocuments(): void {
    this.fileChooser.open()
      .then(res => {
        this.filePath.resolveNativePath(res)
          .then(res => {
            this.propertyDocArr = res;
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  addProperty(): void {
    this.base64.encodeFile(this.propertyDocArr)
      .then(res => {
        console.log('Aamir BASE64: ', res);

        this.tab1Service.uploadDoc({
          propertyId: '61b16200-73f8-11ea-b395-7df1b4b5466c',
          file: res
        })
          .subscribe(res => {
            console.log(res);
          }, err => {
            console.log(err);
          });
      });
  }

  loadStoredImages() {
    this.storage.get(STORAGE_KEY)
      .then(images => {
        if (images) {
          let arr = JSON.parse(images);

          this.images = [];

          for (let img of arr) {
            let filePath = this.file.dataDirectory + img;
            let resPath = this.pathForImage(filePath);

            this.images.push({
              name: img,
              path: resPath,
              filePath: filePath
            });
          }
        }
      })
  }

  selectImages1() {
    const options: ImagePickerOptions = {
      maximumImagesCount: 50,
    };

    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        let fileName = results[i].substring(results[i].lastIndexOf('/') + 1);
        let path = results[i].substring(0, results[i].lastIndexOf('/') + 1);

        this.imageName.push(results[i]);
        console.log(results);

        this.file.readAsDataURL(path, fileName).then((base64String) => {
          console.log(base64String);
          this.imageArray.push("data:image/jpeg;base64, " + base64String);
          console.log('base64', base64String);
        }).catch((err) => {
          this.imageArray.push(err)
          this.imageName.push(err);
        })
      }
    }, (err) => {
      this.error = err;
    });
  }

  async selectImages() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Gallery',
          cssClass: 'action-sheet-btn',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Camera',
          cssClass: 'action-sheet-btn',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          cssClass: 'action-sheet-btn',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType): void {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };

    this.camera.getPicture(options)
      .then((imagePath) => {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

        this.presentToast("Image Path: " + imagePath);

        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }, err => {
        this.presentToast('Something went wrong.');
      });
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    // this.presentToast(namePath);
    // this.presentToast(`${namePath} ${currentName}`);
    // this.presentToast(newFileName);
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName)
      .then(response => {
        this.updateStoredImages(newFileName);
      }, err => {
        // this.presentToast(JSON.stringify(err));
      });
  }

  updateStoredImages(name): void {
    this.storage.get(STORAGE_KEY)
      .then(images => {
        let arr = JSON.parse(images);
        let filePath = this.file.dataDirectory + name;
        let resPath = this.pathForImage(filePath);
        let newEntry = {
          name: name,
          path: resPath,
          filePath: filePath
        };

        if (!arr) {
          let newImages = [name];

          this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
        }
        else {
          arr.push(name);
          this.storage.set(STORAGE_KEY, JSON.stringify(arr));
        }

        this.images = [newEntry, ...this.images];
        this.ref.detectChanges();
      }, err => {
        this.presentToast('Something went wrong.')
      })
  }

  deleteImage(imgEntry, position): void {
    this.images.splice(position, 1);

    this.storage.get(STORAGE_KEY)
      .then(images => {
        let arr = JSON.parse(images);
        let filtered = arr.filter(name => name !== imgEntry.name);
        let correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

        this.storage.set(STORAGE_KEY, JSON.stringify(filtered));
        this.file.removeFile(correctPath, imgEntry.name)
          .then(res => {
            this.presentToast('File Removed.')
          });
      });
  }

  pathForImage(img): string {
    if (img === null) {
      return '';
    }
    else {
      let converted = this.webView.convertFileSrc(img);

      return converted;
    }
  }

  createFileName(): string {
    let d = new Date();
    let n = d.getTime();

    return `${n}.jpg`;
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 5000
    });

    toast.present();
  }

  viewDoc(fileSrc: string): void {
    this.previewAnyFile.preview(fileSrc)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  goBack(): void {
    this.router.navigateByUrl('tabs/tab1');
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

}
