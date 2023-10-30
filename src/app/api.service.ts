import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });
 
  
  API_URL : any = 'http://127.0.0.1:8000/home'

  constructor(private http: HttpClient) {}
  /** User API */
  public getUser():Observable<any> {
    return this.http.get(this.API_URL + '/getUser/');
  }
  public createUser(req: any):Observable<any> {
    return this.http.post(this.API_URL + '/createUser/', req);
  }
  public updateUser(req: any, id: any):Observable<any> {
    return this.http.put(this.API_URL + '/updateUser/'+ id + '/', req);
  }
  public deleteUser( id: any):Observable<any> {
    return this.http.delete(this.API_URL + '/deleteUser/'+ id + '/');
  }

  /** Test API */
  public createTest(req: any): Observable<any>{
    return this.http.post(this.API_URL + '/createTest/', req);
  }
  public getTest(): Observable<any>{
    return this.http.get(this.API_URL + '/getTests/');
  }
  public updateTest(req: any,id: any):Observable<any> {
    return this.http.put(this.API_URL + '/updateTest/' + id + '/', req);
  }
  public deleteTest(id: any):Observable<any> {
    return this.http.delete(this.API_URL + '/deleteTest/' + id + '/');
  }
  

  /**Answer API */
  public createAnswer(req: any): Observable<any>{
    return this.http.post(this.API_URL + '/createTestAnswers/', req);
  }
  public getAnswers(): Observable<any>{
    return this.http.get(this.API_URL + '/getTestAnswers/');
  }

  /**Student summary */
  public getStudentSummary(req: any): Observable<any>{
    return this.http.post(this.API_URL + '/getStudentSummary/'+ req + '/', null)
  }
}
