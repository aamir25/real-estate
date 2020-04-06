import { Component, OnInit } from '@angular/core';

import { Tab1Service } from './tab1.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  propertyIdArr;
  propertiesObject;

  constructor(private tab1Service: Tab1Service) { }

  ngOnInit() {
    this.tab1Service.getAllPropertyListings()
      .subscribe((response) => {
        this.propertyIdArr = Object.keys(response.data)
        this.propertiesObject = response.data;
      });
  }

}
