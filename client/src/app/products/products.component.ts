import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/productService/products.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any;

  constructor(private productsService: ProductsService,
    private router: Router) { }

  ngOnInit() {
    this.getAllProducts().subscribe(data => {
      this.products = data;
      this.productsPrice();
    });
  }

  getAllProducts() {
    return this.productsService.getProducts();
  }

  getProduct(idProduct: number) {
    this.router.navigate(['products', idProduct]);
  }

  isEmployee(): boolean {
    if(sessionStorage.getItem('user')){
      return true;
    }
    return false;
  }
  logout(): void {
    sessionStorage.clear();
    sessionStorage.removeItem('user');
    this.productsPrice();
  }
  productsPrice(): void {
    if(!this.isEmployee()) {
    this.products.forEach(element => {
      if (element.producttype != 3){
      let valorA = element.costprice * 0.1;
      let margen = element.saleprice - element.costprice;
      if (margen > valorA) {
        let excedente = margen - valorA;
        excedente = excedente * 0.8;
        element.saleprice = element.saleprice - excedente;
      }
    }else{
      let margen = element.saleprice - element.costprice;
      let precioFinal = margen * 0.5;

      element.saleprice -= precioFinal;
    }
    }
    );
  }

  }
  
  login():void {
    this.router.navigate(['login']);
  }
}

