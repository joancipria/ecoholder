import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdminDashboardPage } from './admin-dashboard.page';
import { PreviousMapsComponent } from './previous-maps/previous-maps.component';

const routes: Routes = [
  {
    path: 'gjhhj',
    component: AdminDashboardPage
  },
  {
    path: '',
    component: PreviousMapsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminDashboardPage, PreviousMapsComponent]
})
export class AdminDashboardPageModule {}
