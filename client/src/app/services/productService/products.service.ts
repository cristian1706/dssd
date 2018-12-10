import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginComponent } from '../../login/login.component';
import { Product } from '../../productInterface';


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

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productsUrl}/${id}`);
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

  updateStock(idProduct: number, stock: number): Observable<Boolean> {
    return this.http.put<Boolean>(`${this.productsUrl}/${idProduct}/buy`, {stock});
  }

}
