import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdminDashboardNodesPage } from './admin-dashboard-nodes.page';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardNodesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminDashboardNodesPage]
})
export class AdminDashboardNodesPageModule {}
