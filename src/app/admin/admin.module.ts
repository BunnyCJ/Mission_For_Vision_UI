import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { StudentComponent } from './student/student.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes : Routes=[
  { path: '', component: AdminComponent},
  {path: 'student', component: StudentComponent},
  {path: 'user', component: UserComponent}
]

@NgModule({
  declarations: [
    AdminComponent,
    UserComponent,
    StudentComponent
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class AdminModule { }
