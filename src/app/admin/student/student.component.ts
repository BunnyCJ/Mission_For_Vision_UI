import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  name: any;
  userId: any;
  email: any;
  department: any;
  password: any;
  confirmPassword: any;
  isStudent: boolean = true;
  regNo: any;
  updateStudentData: any;
  updateStudentName: any;
  updateStudentUserId: any;
  updateStudentEmail: any;
  updateStudentRegNo: any;
  updateStudentPasword: any;
  updateStudentDepartment: any;
  updateStudentObjId: any;
  userData:any;
  studentList: any;
  deleteStudentObjId: any;

  constructor(
    private apiService : ApiService,
    private router : Router,
    private toastr : ToastrService
  ){} 
  ngOnInit(): void {
    this.getStudents();
  }

  getStudents(){
    this.apiService.getUser().subscribe(res =>{
      this.userData =res;
      console.log(res)
      let val: any = [];
      val = this.userData.filter((d : any) => d.isStudent == true)
      console.log(val)
      this.studentList = val;
      if(val.length == 0){
        this.toastr.warning('No Students found, please add', '',{
          positionClass: 'toast-bottom-right',
          timeOut: 3000
        })
      }
    },
    (err) =>{
      this.toastr.error(err.message, '',{
        positionClass: 'toast-bottom-right',
        timeOut: 3000
      })
    }
    )
  }
  navigateToDashboard(){
    this.router.navigate(['home'])
  }
  submitForm(){
    if(this.password === this.confirmPassword){
      let payload : any = {
        "name": this.name,
        "email": this.email,
        "userId": this.userId,
        "password": this.password,
        "regNo": this.regNo,
        "department": this.department,
        "isStudent": this.isStudent
      }
      this.apiService.createUser(payload).subscribe(res =>{
        let registerResponse = res;
        console.log(registerResponse);
        this.toastr.success(registerResponse.message, '',{
          positionClass: 'toast-bottom-right',
          timeOut: 3000
        })
        this.getStudents();
        this.name = ''
        this.email = ''
        this.userId = ''
        this.confirmPassword = ''
        this.regNo = ''
        this.department = ''
      },
      (err) =>{
        if (err){
          this.toastr.error(err.response, '', {
            positionClass: 'toast-bottom-right',
            timeOut: 3000
          })
        }
      }
      )
    }else{
      this.toastr.error('Password does not match', '',{
        positionClass: 'toast-bottom-right',
        timeOut: 3000
      })
    }
  
  }
  openuUpdateStudentModal(data: any) {
    this.updateStudentName = data.name;
    this.updateStudentUserId = data.userId;
    this.updateStudentRegNo = data.regNo;
    this.updateStudentEmail = data.email;
    this.updateStudentPasword = data.password;
    this.updateStudentDepartment = data.department;
    this.updateStudentObjId= data._id
  }
  updateStudent(){
    let payload : any = {
      "name": this.updateStudentName,
      "email": this.updateStudentEmail,
      "userId": this.updateStudentUserId,
      "password": this.updateStudentPasword,
      "regNo": this.updateStudentRegNo,
      "department": this.updateStudentDepartment,
      "isStudent": this.isStudent
    }
    this.apiService.updateUser(payload,  this.updateStudentObjId ).subscribe(res =>{
      let registerResponse = res;
      this.toastr.success(registerResponse.message, '',{
        positionClass: 'toast-bottom-right',
        timeOut: 3000
      })
      this.getStudents();
      this.updateStudentData = '';
    },
    (err) =>{
      if (err){
        this.toastr.error(err.response, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 3000
        })
      }
    }
    )
  }

  openDeleteStudentModal(data: any) {
    this.deleteStudentObjId = data?._id
  }
  deleteStudent(){
    this.apiService.deleteUser( this.deleteStudentObjId ).subscribe(res =>{
      this.toastr.success(res.message, '',{
        positionClass: 'toast-bottom-right',
        timeOut: 3000
      })
      this.getStudents();
      this.deleteStudentObjId='';
    },
    (err) =>{
      if (err){
        this.toastr.error(err.response, '', {
          positionClass: 'toast-bottom-right',
          timeOut: 3000
        })
      }
    }
    )
  }
}
