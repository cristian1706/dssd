import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/productService/products.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Product } from '../productInterface';
import { BonitaService } from '../services/bonitaService/bonita.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product;
  idProduct: number;
  coupon: any;
  bonitaToken: string;
  idBonitaProcess: number;
  bonitaCaseId: number;
  bonitaState: string;
  userId = 0;
  couponId = 0;
  procesos: any[];
  constructor(private productService: ProductsService,
              private router: ActivatedRoute,
              private location: Location,
              private bonita: BonitaService,
              private cookie: CookieService) { }

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
        this.bonitaToken = this.cookie.get('X-Bonita-API-Token');
        console.log(`token bonita: ${this.cookie.get('X-Bonita-API-Token')}`);

        //guardo el token y se lo paso al processList para saber el id del proceso
        this.bonita.getProcess(this.bonitaToken).subscribe(
          (data: any) => {
            this.idBonitaProcess = data.body[0].id;
            console.log(`id proceso bonita: ${this.idBonitaProcess}`);

            //start case
            this.bonita.startCase(this.idBonitaProcess,this.product.id,this.couponId,this.userId).subscribe(
              (data: any) => {
                var argumentos: any[] = [];
                argumentos.push(this.idBonitaProcess);
                argumentos.push(this.bonita);
                this.bonitaCaseId = data.body.id;
                console.log(`case id: ${this.bonitaCaseId}`);                
                 //checkeo de variables del caso 
                 this.bonita.checkCaseVariables(this.bonitaCaseId).subscribe(
                  (data) => {
                    console.log(`case variables del caso ${this.bonitaCaseId}`);
                    console.log(data.body);
                  },
                  (err) => {
                    console.log("error en checkTasks");
                    console.log(err);
                  }
                );
                setTimeout(function(){
                  this.bonita= argumentos[1];
                  this.bonita.checkTasks(argumentos[0]).subscribe(
                    (data: any) => {
                      console.log(data.body);                        
                      let humanTaskId = data.body[data.body.length - 1].id;
                      console.log('human task id=' + humanTaskId);
                      //execute human task
                      this.bonita.humanTask(humanTaskId).subscribe(
                        (data:any) => {
                          console.log("entra human task");
                          console.log(data);
                        },
                        (err) => {
                          console.log("error human task");
                          console.log(err);
                        }
                      );
                    }
                  )
                 },3000,argumentos);
              },
              (err) => {
                console.log("error start case");
                console.log(err);
              }
            );
          },
          (error) => {
            console.log("error en processList");
            console.log(error);
          }
        );
      },
      (error) => {
        console.log("error en login")
        console.log(error);
      }
    );
    this.cookie.delete('X-Bonita-API-Token');
    
    
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
  setVariables(): void {
    if(this.isEmployee) {
      this.userId = 1;
    }
    if(this.coupon !== undefined) {
      this.couponId = 0;
    } else {
      this.couponId = this.coupon.id;
    }
  }

  isEmployee(): boolean {
    if (sessionStorage.getItem('user')) {
      return true;
    } else {
      return false;
    }
    
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

