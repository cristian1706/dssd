import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/productService/products.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Product } from '../productInterface';
import { BonitaService } from '../services/bonitaService/bonita.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product;
  idProduct: number;
  coupon: any;
  constructor(private productService: ProductsService,
              private router: ActivatedRoute,
              private location: Location,
              private bonita: BonitaService) { }

  ngOnInit() {
    this.getProduct();
  }

  getProduct() {
    const idProduct = + this.router.snapshot.paramMap.get('id');
    return this.productService.getProduct(idProduct).subscribe(
      (data: any) => {
        this.product = data.data[0];
        this.productPrice();
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
        },
        (err) => {
          alert("El número de cupón no existe");
        }
      );
    }
  }
  updatePrice(): number {
    if (this.coupon.used !== 1) {
      //this.useCoupon(this.coupon.id);
      this.product.saleprice = (this.product.saleprice * this.coupon.discount) / 100 ;
    } else {
      alert('El cupón ya fue utilizado anteriormente');
    }
    return this.product.saleprice;
  }

  useCoupon(idCoupon): void {
    this.productService.useCoupon(idCoupon).subscribe(
      (data: any) => {
        alert(data.msj);
      },
      error => {
        alert('Error al usar el cupon');
      }
    );
  }

  buyProduct(): void {
    this.bonita.login().subscribe(
      (data: any) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
    }
    /*if(this.product.stock > 0){
      if (confirm(`¿Desea comprar el producto ${this.product.name}? `)) {
        
        this.product.stock--;
        this.productService.updateStock(this.product.id, this.product.stock).subscribe(
          (data: any) => {
            alert(`Has comprado el producto ${this.product.name}`);
            this.location.back();
          },
          (err) => {
            console.log(err);
            alert('Error al comprar el producto');
          }
        );
      }
    }
    else {
      alert(`No hay stock del producto ${this.product.name}`);
      this.location.back();
    }
  }*/

  isEmployee(): boolean {
    if (sessionStorage.getItem('user')) {
      return true;
    }
    return false;
  }
  logout(): void {
    sessionStorage.clear();
    sessionStorage.removeItem('user');
    this.productPrice();
  }
  productPrice(): void {
    if (!this.isEmployee()) {
        if (this.product.producttype != 3) {
          let valorA = this.product.costprice * 0.1;
          let margen = this.product.saleprice - this.product.costprice;
          if (margen > valorA) {
            let excedente = margen - valorA;
            excedente = excedente * 0.8;
            this.product.saleprice = this.product.saleprice - excedente;
          }
        } else {
          let margen = this.product.saleprice - this.product.costprice;
          let precioFinal = margen * 0.5;
          this.product.saleprice -= precioFinal;
        }
    }
  }
}

