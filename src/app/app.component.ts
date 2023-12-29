import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isLoginView: boolean = true;

  registerObj: any = {
    UserId: 0,
    Name: '',
    Email: '',
    Password: '',
    ContactNo: '',
    Role: '',
  };

  loginObj: any = {
    Password: '',
    ContactNo: '',
  };

  isUserLoggedin: boolean = false;
  loggedUserData: any;

  constructor(private http: HttpClient) {
    const localData = localStorage.getItem('eventUser');
    if (localData != null) {
      this.isUserLoggedin = true;
      this.loggedUserData = JSON.parse(localData);
    }
  }

  openLogin() {
    const modal = document.getElementById('myModal');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  closeModal() {
    const modal = document.getElementById('myModal');
    if (modal != null) {
      modal.style.display = 'none';
    }
  }

  onRegister() {
    this.http
      .post(
        'https://freeapi.miniprojectideas.com/api/EventBooking/CreateUser',
        this.registerObj
      )
      .subscribe((res: any) => {
        if (res.result) {
          alert('registration success');
          this.closeModal();
        } else {
          alert(res.message);
        }
      });
  }

  onLogin() {
    this.http
      .post(
        'https://freeapi.miniprojectideas.com/api/EventBooking/Login',
        this.loginObj
      )
      .subscribe((res: any) => {
        if (res.result) {
          alert('login success');
          localStorage.setItem('eventUser', JSON.stringify(res.data));
          this.closeModal();
        } else {
          alert('res.message');
        }
      });
  }
}
