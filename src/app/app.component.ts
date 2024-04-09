import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {


  registrationForm: FormGroup;
  isLoginView: boolean = true;
  loginForm: FormGroup;

  //this object is not required in reactive form
  // registerObj: any = {
  //   UserId: 0,
  //   Name: '',
  //   Email: '',
  //   Password: '',
  //   ContactNo: '',
  //   Role: '',
  // };

  //this object is not required in reactive form
  // loginObj: any = {
  //   Password: '',
  //   ContactNo: '',
  // };

  isUserLoggedin: boolean = false;
  loggedUserData: any;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      Name: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required]),
      ConfirmPassword: new FormControl('', [Validators.required, this.confirmPasswordValidator.bind(this)]),
      ContactNo: new FormControl('', [Validators.required, Validators.minLength(10)]),
      Role: new FormControl('', [Validators.required]),
    }
    );

    this.loginForm = this.fb.group({
      Password: new FormControl('', [Validators.required]),
      ContactNo: new FormControl('', [Validators.required]),
    })

    const localData = localStorage.getItem('eventUser');
    if (localData != null) {
      this.isUserLoggedin = true;
      this.loggedUserData = JSON.parse(localData);
    }



  }

  ngOnInit(): void {
  }

  confirmPasswordValidator(control: FormControl): { [s: string]: any } | null {

    if (this.registrationForm && control.value !== this.registrationForm.get('Password')?.value) {
      return { 'passwordMismatch': true };
    }
    else {
      return null;
    }
  }

  openLogin() {
    this.loginForm.reset();
    const modal = document.getElementById('myModal');
    if (modal != null) {
      modal.style.display = 'block';
      this.isLoginView = true;
    }
  }

  openRegister() {
    const modal = document.getElementById('myModal');
    if (modal != null) {
      modal.style.display = 'block';
      this.isLoginView = false;
    }
  }

  closeModal() {
    const modal = document.getElementById('myModal');
    if (modal != null) {
      modal.style.display = 'none';
    }
  }

  // Function to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onRegister() {

    if (this.registrationForm.invalid) {
      return;
    }

    this.http
      .post('https://freeapi.gerasim.in/api/EventBooking/CreateUser', this.registrationForm.value).subscribe((res: any) => {
        if (res.result) {
          alert('registration success');
          this.closeModal();
        } else {
          alert(res.message);
        }
      });
  }


  onLogOff() {
    localStorage.removeItem('eventUser');
    this.isUserLoggedin = false;
    this.loggedUserData = undefined;
  }

  onLogin() {
    //this method shows an erorr when you directly click on login button without touch contact and password
    this.markFormGroupTouched(this.loginForm);

    if (this.loginForm.valid) {
      this.http
        .post(
          'https://freeapi.gerasim.in/api/EventBooking/Login', this.loginForm.value
        )
        .subscribe((res: any) => {
          if (res.result) {
            alert('login success');
            localStorage.setItem('eventUser', JSON.stringify(res.data));
            this.isUserLoggedin = true;
            this.loggedUserData = res.data;
            this.closeModal();
          } else {
            alert('res.message');
          }
        });
    }
  }
}
