import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/productService/products.service'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any;
  displayedColumns: string[] = ['name', 'saleprice'];

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.getAllProducts().subscribe(data => {
      this.products = data;
    });
  }
  getAllProducts() {
    return this.productsService.getProducts();
  }
}
