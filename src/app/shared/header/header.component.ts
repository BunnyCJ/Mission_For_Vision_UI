import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { exportService } from 'src/app/service/export.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
isAdmin : boolean = false;
isLoggedIn: boolean = false;
userName: any =''
userType : any = '';
isStudent : boolean = false;

public constructor( 
  private logService: exportService, 
  private router: Router,
  private authService : AuthService
  ){}

  ngOnInit(): void {
    this.getUserDetails();
  }

  logout() {
    this.userDetails ='';
    this.authService.logout(); // Call the logout method in AuthService
    this.router.navigate(['/login']); // Redirect the user to the login page or any other desired location
  }
setLogOut(){
  this.userDetails=[]
  let val = {
    'isLoggedin' : false
  }
  this.logService.updateLoggedInDetails(val);
  this.isLoggedIn = false;
  this.router.navigate(["/login"])
}

userDetails:any='';
getUserDetails(){
  this.logService.getUserDetails().subscribe(res =>{
    this.userDetails = res
    console.log(res)
    if(this.userDetails){
      this.isLoggedIn = true;
      sessionStorage.setItem('userLogin', JSON.stringify(this.userDetails));
    }else{
        let val: any = sessionStorage.getItem('userLogin')
        let d = JSON.parse(val)
        this.userDetails = d;
        // if(d.load){
        //   sessionStorage.removeItem('viewTest')
        // }
    }
  })
}

}
