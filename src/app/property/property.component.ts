import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx'
import { DomSanitizer } from '@angular/platform-browser';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { AlertController, ToastController } from '@ionic/angular';

import { Tab1Service } from '../tab1/tab1.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
})
export class PropertyComponent implements OnInit, OnDestroy {

  propertyId: string;
  propertyDetails: any;
  routeSub: Subscription;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  propertyImages = [];
  propertyDocuments = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private tab1Service: Tab1Service,
    private photoViewer: PhotoViewer,
    public domSanitizer: DomSanitizer,
    private previewAnyFile: PreviewAnyFile,
    private router: Router,
    private alertController: AlertController,
    private toasterController: ToastController
  ) { }

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      this.propertyId = params.id;

      this.getPropertyDetails();
    });
  }

  getPropertyDetails(): void {
    this.tab1Service.getPropertyById(this.propertyId).subscribe(response => {
      this.propertyDetails = response.data;

      if (response.data.propertyExtraInfo && response.data.propertyExtraInfo.images) {
        this.propertyImages = response.data.propertyExtraInfo.images;
      }
      if (response.data.propertyExtraInfo && response.data.propertyExtraInfo.documents) {
        this.propertyDocuments = response.data.propertyExtraInfo.documents;
      }
    }, err => {
      console.log(err);
    });
  }

  editListing(): void {
    this.router.navigateByUrl(`tabs/tab1/edit/${this.propertyId}`);
  }

  async deleteListing() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete this listing?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'secondary-button',
          role: 'cancel'
        }, {
          text: 'Yes',
          cssClass: 'primary-button',
          handler: () => {
            this.tab1Service.deleteProperty(this.propertyId)
              .subscribe(res => {
                this.goBack();
                this.presentToast('Property Deleted.');
              });
          }
        }
      ]
    });

    await alert.present();
  }

  viewDoc(fileSrc: string): void {
    this.previewAnyFile.preview(fileSrc)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  async presentToast(text) {
    const toast = await this.toasterController.create({
      message: text,
      position: 'bottom',
      duration: 5000
    });

    toast.present();
  }

  goBack(): void {
    this.router.navigateByUrl('tabs/tab1');
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

}
