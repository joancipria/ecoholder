import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdminDashboardUsersPage } from './admin-dashboard-users.page';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardUsersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminDashboardUsersPage]
})
export class AdminDashboardUsersPageModule {}
