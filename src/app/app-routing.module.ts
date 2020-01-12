import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'app', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'dashboard', loadChildren: './admin-dashboard/admin-dashboard.module#AdminDashboardPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'directions', loadChildren: './routes/directions/directions.module#DirectionsPageModule' },
  { path: 'information', loadChildren: './home/information/information.module#InformationPageModule' },
  { path: 'nodes', loadChildren: './admin-dashboard-nodes/admin-dashboard-nodes.module#AdminDashboardNodesPageModule' },
  { path: 'users', loadChildren: './admin-dashboard-users/admin-dashboard-users.module#AdminDashboardUsersPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
