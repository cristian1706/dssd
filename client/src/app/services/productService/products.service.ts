import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ProductsComponent } from '../../products/products.component';
import { LoginComponent } from '../../login/login.component';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  private productsUrl = 'http://localhost:3000/product';
  private userUrl = 'http://localhost:3000/employee/login';
  loading: boolean;
  products: any;

  getProducts(): Observable<ProductsComponent[]> {
    return this.http.get<ProductsComponent[]>(this.productsUrl);
  }

  getProduct(id: number): Observable<ProductsComponent> {
    return this.http.get<ProductsComponent>(`${this.productsUrl}/${id}`);
  }

  getUser(mail: string, pass: string): Observable<LoginComponent> {
    return this.http.post<LoginComponent>(this.userUrl, {email: mail, password: pass});
  }


}
