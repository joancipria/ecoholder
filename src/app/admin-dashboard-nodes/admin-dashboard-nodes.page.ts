import { Firebase } from './../core/services/firebase.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-admin-dashboard-nodes',
  templateUrl: './admin-dashboard-nodes.page.html',
  styleUrls: ['./admin-dashboard-nodes.page.scss'],
})
export class AdminDashboardNodesPage implements OnInit {

  constructor(
    private firebase: Firebase
  ) {
  }

  ngOnInit() {
    this.firebase.getNodes();
  }

}
