import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/productService/products.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  idProduct: number;
  coupon: any;
  constructor(private productService: ProductsService,
              private router: ActivatedRoute,
              private location: Location) { }

  ngOnInit() {
    this.getHero();
  }

  getHero() {
    const idProduct = + this.router.snapshot.paramMap.get('id');
    return this.productService.getProduct(idProduct).subscribe(
      (data: any) => {
        this.product = data.data[0];
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  getCoupon(): void {
    const couponId = + prompt('Por favor ingrese el número de cupón');
    if (couponId) {
      this.productService.getCoupon(couponId).subscribe(
        (data: any) => {
          this.coupon = data.data[0];
          this.updatePrice();
        }
      );
    }
  }
  updatePrice(): number {
    this.useCoupon(this.coupon.id);
    this.product.saleprice = (this.product.saleprice * this.coupon.discount) / 100 ;
    return this.product.saleprice;
  }

  useCoupon(idCoupon): boolean {
    this.productService.useCoupon(idCoupon).subscribe(
      (data: any) => {
        alert(data.msj);
      },
      error => {
        alert('Error al usar el cupon');
      }
    );
    return true;
  }

  buyProduct(): void {
    alert(`Has comprado el producto ${this.product.name}`);
    this.location.back();
  }

  isEmployee(): boolean {
    const employee = + sessionStorage.getItem('user');
    return employee === 1;
  }
}

