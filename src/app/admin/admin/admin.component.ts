import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';
import { exportService } from 'src/app/service/export.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(
    private apiService : ApiService,
    private toastr :ToastrService,
    private router : Router,
    private logService : exportService
  ){}
  ngOnInit(): void {
    this.getTests();
    this.getUserDetails();
  }

  userDetails: any;
  getUserDetails(){
    this.logService.getUserDetails().subscribe(res =>{
      this.userDetails = res;
      console.log( this.userDetails)
    })
  }

  navigateToDashboard(){
    this.router.navigate(['home'])
  }
  questionData: any;
  subject: any;
  testName: any;
  question: any;
  getQuestions(){
    this.apiService.getTest().subscribe(res =>{
      this.questionData = res
      console.log(this.questionData)
    })
  }
  updateId: any;
  updatedSubject: any;
  updatedQuestion: any;
  updateAnswerSheet: any;
  updateAnswerSheetTest: any;
  testScore: any;
  openUpdateQuestionModal(data : any){
    this.updatedSubject = data.subject,
    this.updatedQuestion = data.question,
    this.updateId = data.id
  }

  answeredTestData: any;
  getTests(){
    this.apiService.getTest().subscribe(res =>{
      let val : any =[];
      val = res.filter((d: any) => d.answeredBy && !d.score)
      this.answeredTestData = val
      if(res.length == 0){
        this.toastr.warning('No test found', '',{
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

  openUpdateAnswerModal(data: any){
    this.updateAnswerSheet = data
    this.updateAnswerSheetTest = data.test
    console.log(data)
  }

  submitTestReview(){
    let payload ={
      "userId": this.updateAnswerSheet?.userId,
      "isStudent": this.updateAnswerSheet?.isStudent,
      "testName":this.updateAnswerSheet?.testName,
      "subject": this.updateAnswerSheet?.subject,
      "test": this.updateAnswerSheet?.test,
      "answeredBy": this.updateAnswerSheet?.answeredBy,
      "regNo": this.updateAnswerSheet?.regNo,
      "createdBy": this.updateAnswerSheet?.createdBy,
      "score":this.testScore,
      "reviewedBy": this.userDetails.name,
    }
    console.log(payload)
    this.apiService.updateTest(payload, this.updateAnswerSheet?._id).subscribe(res =>{
      console.log(res)
      this.toastr.success(res.message, '',{
        positionClass: 'toast-bottom-right',
        timeOut: 3000
      })
      this.getTests();
    },
    (err) =>{
      this.toastr.error('something went wrong', '',{
        positionClass: 'toast-bottom-right',
        timeOut: 3000
      })
    }
    )
  }
 
}
