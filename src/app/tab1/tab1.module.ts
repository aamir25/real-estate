import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatRippleModule } from '@angular/material';
import { Tab1RoutingModule } from './tab1-routing.module';
import { File } from '@ionic-native/file/ngx'
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { IonicStorageModule } from '@ionic/storage'
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { Tab1Service } from './tab1.service';

import { Tab1Page } from './tab1.page';
import { HeaderComponent } from '../header/header.component';
import { ViewPropertiesComponent } from '../view-properties/view-properties.component';
import { AddPropertyComponent } from '../add-property/add-property.component';
import { PropertyComponent } from '../property/property.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1RoutingModule,
    HttpClientModule,
    MatButtonModule,
    IonicStorageModule.forRoot(),
    MatRippleModule
  ],
  declarations: [
    Tab1Page,
    ViewPropertiesComponent,
    AddPropertyComponent,
    HeaderComponent,
    PropertyComponent
  ],
  providers: [
    Tab1Service,
    File,
    ImagePicker,
    Camera,
    WebView,
    PhotoViewer,
    FileTransfer,
    DocumentViewer,
    PreviewAnyFile,
    FileChooser,
    FilePath,
    Base64,
    AndroidPermissions
  ]
})
export class Tab1PageModule { }
