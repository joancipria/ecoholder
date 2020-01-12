import { Component, OnInit } from '@angular/core';
import { Firebase } from './../core/services/firebase.service';

@Component({
  selector: 'app-admin-dashboard-users',
  templateUrl: './admin-dashboard-users.page.html',
  styleUrls: ['./admin-dashboard-users.page.scss'],
})
export class AdminDashboardUsersPage implements OnInit {

  constructor(
    private firebase: Firebase
  ) { }

  ngOnInit() {
    this.firebase.getUsers();
  }

}
