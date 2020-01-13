import { Firebase } from './../core/services/firebase.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-admin-dashboard-nodes',
  templateUrl: './admin-dashboard-nodes.page.html',
  styleUrls: ['./admin-dashboard-nodes.page.scss'],
})
export class AdminDashboardNodesPage implements OnInit {

  private nodes: Array<Object>;

  constructor(
    private firebase: Firebase
  ) {
  }

  async ngOnInit() {
    this.nodes = await this.firebase.getNodes();
  }

}
