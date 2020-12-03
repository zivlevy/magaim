import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MagaService {
  cities = [];
  constructor(private http: HttpClient) { }

  getCountries(): any {
    return this.http.get<any>('assets/cities.json')
      .toPromise()
      .then(res => res.data as any[])
      .then(data => data);
  }
}



