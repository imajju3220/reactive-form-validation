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

  // registerObj: any = {
  //   UserId: 0,
  //   Name: '',
  //   Email: '',
  //   Password: '',
  //   ContactNo: '',
  //   Role: '',
  // };

  loginObj: any = {
    Password: '',
    ContactNo: '',
  };

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

    const localData = localStorage.getItem('eventUser');
    if (localData != null) {
      this.isUserLoggedin = true;
      this.loggedUserData = JSON.parse(localData);
    }



  }

  ngOnInit(): void {


  }

  confirmPasswordValidator(control: FormControl): { [s: string]: boolean } {
    if (this.registrationForm && control.value !== this.registrationForm.get('Password')?.value) {
      return { 'passwordMismatch': true };
    }
    return { 'passwordMismatch': false };
  }

  openLogin() {
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

  passwordMatchCase() {
    var cc = this.registrationForm.get("Password")?.value
    var dd = this.registrationForm.get("ConfirmPassword")?.value

    if (cc == dd) {
      alert('both password match');
    } else {
      alert('did not match');
      return
    }
  }


  onRegister() {
    this.passwordMatchCase()
    if (this.registrationForm.invalid) {
      return;
    }

    console.log(JSON.stringify(this.registrationForm.value, null, 2));
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
    this.http
      .post(
        'https://freeapi.gerasim.in/api/EventBooking/Login',
        this.loginObj
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
