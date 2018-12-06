import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsComponent } from '../../products/products.component';
import { LoginComponent } from '../../login/login.component';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  private productsUrl = 'http://localhost:3000/product';
  private userUrl = 'http://localhost:3000/employee/login';
  private couponUrl = 'http://localhost:3000/coupon';
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

  getCoupon(idCoupon: number): Observable<Number> {
    return this.http.get<Number>(`${this.couponUrl}/${idCoupon}`);
  }

  useCoupon(idCoupon: number): Observable<Boolean> {
    return this.http.put<Boolean>(`${this.couponUrl}/use/${idCoupon}`, {});
  }

}
