import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class exportService {
    private log = new BehaviorSubject<any>({});
    private userDetails = new BehaviorSubject<any>({});

    getLoggedInDetails():Observable<any>{
        return this.log.asObservable();
      }
      
    updateLoggedInDetails(newval:any):void{
        this.log.next(newval);
      }
    
    getUserDetails():Observable<any>{
      return this.userDetails.asObservable();
    }
     
    updateUserDetails(val: any):void{
        this.userDetails.next( val);
    }
}