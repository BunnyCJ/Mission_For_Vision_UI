import { Component, OnInit } from '@angular/core';
import { exportService } from './service/export.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'learn';
  isLoggedIn: boolean = false;
  public constructor( private logService: exportService){}
ngOnInit(): void {
  // this.getLoggedDetails()
}
// getLoggedDetails(){
//   debugger
//   this.logService.getLoggedInDetails().subscribe(res =>{
//     let response = res;
//     if(response.isLoggedin){
//       this.isLoggedIn = true;
//     }
//   })
// }
}
