import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { exportService } from '../service/export.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL : any = 'http://127.0.0.1:8000/home'
  userDetails: any;

  constructor( 
    private http : HttpClient,
    private apiService : ApiService,
    private exportService : exportService,
    private router: Router
    ) { }

  login(username: string, password: string): boolean {
    let userData : any ;
    this.getUsersFromAPI().subscribe((users: any) => {
      console.log(users)
      users.forEach((d: any) =>{
        if( d.name == username && d.password == password){
          // Authentication successful
            userData = d
        }
      })
      if (userData) {
        this.router.navigate(['/home'])
        this.userDetails = userData
        this.exportService.updateUserDetails(this.userDetails)
       }
    });
    
    return !!this.userDetails; // Return authentication status
  }

  // Logout function
  logout(): void {
    // Clear user data
    this.userDetails = null;
    this.exportService.updateUserDetails(this.userDetails)
  }

  getUserDetails(): any {
    return this.userDetails;
  }

  // Getter to check authentication status
  get isAuthenticated(): boolean {
    return !!this.userDetails; // Check if user details exist to determine authentication status
  }

  // Getter to access user details
  get user(): any {
    return this.userDetails;
  }


  // Simulate fetching users from the API
  private getUsersFromAPI(): any {
   const headers = new HttpHeaders({
      'Content-Type': 'application/json',
  });
    return this.http.get(this.API_URL + '/getUser/', { headers, withCredentials: true })
  }
}
