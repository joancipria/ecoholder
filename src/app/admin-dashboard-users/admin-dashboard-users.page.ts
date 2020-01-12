import { Component, OnInit } from '@angular/core';
import { Firebase } from './../core/services/firebase.service';

@Component({
  selector: 'app-admin-dashboard-users',
  templateUrl: './admin-dashboard-users.page.html',
  styleUrls: ['./admin-dashboard-users.page.scss'],
})
export class AdminDashboardUsersPage implements OnInit {
  private users: Array<Object>;
  constructor(
    private firebase: Firebase
  ) { }

  async ngOnInit() {
    this.users = await this.firebase.getAllusers();
    console.log(this.users);
  }

}
