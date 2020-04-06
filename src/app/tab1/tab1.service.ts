import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '../app.contant';

@Injectable({
  providedIn: 'root'
})
export class Tab1Service {

  constructor(private http: HttpClient) { }

  getAllPropertyListings(): Observable<any> {
    return this.http.get(`${BASE_URL}/listings`);
  }

  getPropertyById(propertyId: string): Observable<any> {
    return this.http.get(`${BASE_URL}/listings/${propertyId}`);
  }

  deleteProperty(id: string): Observable<any> {
    return this.http.delete(`${BASE_URL}/listings/${id}`);
  }

  getAllRegions(): Observable<any> {
    return this.http.get(`${BASE_URL}/listings/getRegion`);
  }

  uploadDoc(payload: any): Observable<any> {
    let body = new FormData();
    body.append('propertyId', payload.propertyId);
    body.append('file', payload.file);

    return this.http.post(`${BASE_URL}/listings/uploadDocuments`, body);
  }

  filterListingsOnRegion(region: string): Observable<any> {
    return this.http.get(`${BASE_URL}/search/propertySearch?pattern=${region}&searchOn=propertyRegion`);
  }

  searchOnName(propertyName: string): Observable<any> {
    return this.http.get(`${BASE_URL}/search/propertySearch?pattern=${propertyName}&searchOn=propertyName`);
  }
}
