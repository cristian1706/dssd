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
    });
  }

  getAllProducts() {
    return this.productsService.getProducts();
  }

  getProduct(idProduct: number) {
    this.router.navigate(['products', idProduct]);
  }
}

