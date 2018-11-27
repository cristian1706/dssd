import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/productService/products.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  idProduct: number;
  constructor(private productService: ProductsService,
              private router: ActivatedRoute,
              private location: Location) { }

  ngOnInit() {
    this.getHero();
  }

  getHero() {
    const idProduct = + this.router.snapshot.paramMap.get('id');
    return this.productService.getProduct(idProduct).subscribe(
      data => {
        this.product = data.data[0];
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
}
