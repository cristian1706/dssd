import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../services/productService/products.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    url: 'http://localhost:3000/employee/login';
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private productService: ProductsService) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            mail: ['', Validators.required],
            password: ['', Validators.required]
        });

        // set return url
        this.returnUrl = '/products';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this.authenticate(this.f.mail.value, this.f.password.value);
    }
    authenticate(mail: string, pass: string) {
      this.productService.getUser(mail, pass).subscribe(
          data => {
              this.router.navigate([this.returnUrl]);
          },
          error => {
            this.loading = false;
            alert('error al iniciar sesion');
          });
    }
}
