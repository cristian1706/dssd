import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ProductsComponent } from '../../products/products.component'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  private productsUrl = 'http://localhost:3000/product';
  loading: boolean;
  products: any;

  getProducts (): Observable<ProductsComponent[]> {
    //console.log(this.http.get(this.productsUrl));
    //this.loading = true;
    return this.http.get<ProductsComponent[]>(this.productsUrl);
  }


}
