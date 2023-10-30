import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestPageComponent } from './test-page/test-page.component';
import { SpeechToTextComponent } from './speech-to-text/speech-to-text.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: "home", component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  { path: '', redirectTo: "login", pathMatch: "full" },
  { path: "test", component: TestPageComponent, canActivate: [AuthGuard]},
  { path: "taketest", component: SpeechToTextComponent, canActivate: [AuthGuard]},
  {
    path: 'admin',
    loadChildren: () => import('../app/admin/admin.module').then(m=> m.AdminModule), canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

  
}


