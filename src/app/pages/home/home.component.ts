import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  events: any[] = [];
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.loadAllEvent();
  }
  loadAllEvent() {
    this.http
      .get('https://freeapi.miniprojectideas.com/api/EventBooking/GetAllEvents')
      .subscribe((res: any) => {
        this.events = res.data;
      });
  }
}
