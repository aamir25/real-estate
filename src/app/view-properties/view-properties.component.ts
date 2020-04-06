import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { Tab1Service } from '../tab1/tab1.service';

@Component({
  selector: 'app-view-properties',
  templateUrl: './view-properties.component.html',
  styleUrls: ['./view-properties.component.scss'],
})
export class ViewPropertiesComponent implements OnInit {

  propertyIdArr;
  propertiesObject;
  regionActionSheetOptions: any = {
  };
  regionsArr = [];
  searchPattern;

  constructor(
    private tab1Service: Tab1Service,
    private router: Router,
    public domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.tab1Service.getAllPropertyListings()
      .subscribe((response) => {
        this.assignPropertyArray(response.data);
      });

    this.tab1Service.getAllRegions()
      .subscribe(response => {
        this.regionsArr = response.data.sort();
      });
  }

  assignPropertyArray(response: any): void {
    this.propertyIdArr = Object.keys(response);
    this.propertiesObject = response;
  }

  goToProperty(propertyId: string): void {
    this.router.navigateByUrl(`tabs/tab1/property/${propertyId}`);
  }

  filterRegion(region: string): void {
    this.tab1Service.filterListingsOnRegion(region)
      .subscribe(response => {
        this.assignPropertyArray(response.data);
      });
  }

  searchOnName(): void {
    this.tab1Service.searchOnName(this.searchPattern)
      .subscribe(response => {
        this.assignPropertyArray(response.data);
      });
  }

}
