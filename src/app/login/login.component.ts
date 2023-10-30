import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { exportService } from '../service/export.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: any;
  password: any;
  userId: any;
  name: any;
  email: any;
  confirmPassword: any;
  isRegister: boolean = false;
  isLogin: boolean = true;
  isTeacher: boolean = false;
  isStudent: boolean = false;
  department: any='';
  regNo: any='';

  public constructor( 
    private router : Router, 
    private logService : exportService,
    private toastr : ToastrService,
    private apiService : ApiService,
    private authService: AuthService
    ){}

  ngOnInit(): void {}

  newUser(){
    this.isLogin = false;
    this.isRegister = true;
  }
  ExistingUser(){
    this.isLogin = true;
    this.isRegister = false;
  }

  userData: any;
  getUserData(){
    this.apiService.getUser().subscribe(res =>{
      this.userData = res;
      if(this.userData.users.length == 0){
        this.toastr.warning('No user found, please register', '',{
          positionClass: 'toast-bottom-right',
          timeOut: 3000
        })
      }else{
      let val: any = this.userData.users.filter((d: any) =>{
          if(d.name == this.username && d.password == this.password){
            return d
          }
        })
        if(val.length != 0){
          let value = {
            isLoggedin : true
           }
          this.logService.updateLoggedInDetails(value);
          this.logService.updateUserDetails(val);
          this.router.navigate(["home"]);
        }else{
          this.toastr.error('Invalid credentials', '',{
            positionClass: 'toast-bottom-right',
            timeOut: 3000
          })
        }
      }
    },
    (err) =>{
      this.toastr.error('something went wrong', '',{
        positionClass: 'toast-bottom-right',
        timeOut: 3000
      })
    }
    )
  }
  submitForm(){
    if(this.password === this.confirmPassword){
      let payload : any = {
        "name": this.name,
        "email": this.email,
        "userId": this.userId,
        "password": this.confirmPassword,
        "regNo": this.regNo,
        "department": this.department,
        "isStudent": this.isStudent
      }
      if(this.isStudent && !this.isTeacher){
        payload.isStudent = true;
      }else if(!this.isStudent && this.isTeacher){
        payload.isStudent = false;
      }
      this.apiService.createUser(payload).subscribe(res =>{
        let registerResponse = res;
        console.log(registerResponse);
        this.toastr.success(registerResponse.message, '',{
          positionClass: 'toast-bottom-right',
          timeOut: 3000
        })
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
  typeStudent(){
    this.isTeacher = false;
  }
  typeTeacher(){
    this.isStudent = false;
  }

  onLogin() {
    const { username, password } = this;
    if (username && password) {
      const loggedIn = this.authService.login(username, password);
      if (loggedIn) {
        // Redirect to a protected route upon successful login
        this.router.navigate(['/home']);
      } else {
        // this.toastr.error('Invalid username or password', '',{
        //   positionClass: 'toast-bottom-right',
        //   timeOut: 3000
        // })
      }
    } else {
      this.toastr.error('Please enter both username and password', '',{
        positionClass: 'toast-bottom-right',
        timeOut: 3000
      })
    }
  }
}
