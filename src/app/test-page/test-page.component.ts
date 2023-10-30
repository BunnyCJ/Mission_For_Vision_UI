import { Component } from '@angular/core';
import { VoiceReco2Service } from '../service/voice-reco2.service';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { exportService } from '../service/export.service';
import { VoiceRecognitionService } from '../service/voice-recognition.service';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css']
})
export class TestPageComponent {
  text: any;
  questionData: any;
  reviewTestCount: any;
  testData: any;
  testDataCount: any;
  filteredTestData :any =[];
  completedTestCount: any;
  completedTestList: any;
  overallTestCount: any;
  avg_score: any=0;
  uncompletedTestList: any;
  uncompletedTestCount: any;
  launchTestData: any;
  isViewTest: boolean = true;
  testAnswer: any;
  userDetails:any;
  synth: any;

  constructor(
    public service : VoiceReco2Service,
    private apiService : ApiService,
    private toastr : ToastrService,
    private router : Router,
    private exportService : exportService,
  ) { }

  ngOnInit(): void {
    this.getUserDetails()
    this.getTests();
  }
 
  getSessionValues(){
    let val: any = sessionStorage.getItem('viewTest')
    let d = JSON.parse(val)
    console.log(d)
    if(d.load){
      this.isViewTest = true;
      sessionStorage.removeItem('viewTest')
    }
  }
  getUserDetails(){
    this.exportService.getUserDetails().subscribe(res =>{
      this.userDetails = res
      console.log(res)
    })
  }
  
  getTests(){
      this.apiService.getTest().subscribe(res =>{
        this.testData = res;
        console.log(res)
        // for Students
        this.filteredTestData = this.testData.filter((d: any )=> d.regNo == this.userDetails?.regNo && !d.answeredBy)
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
  
  launchTest(data: any) {
    this.launchTestData = data
    console.log(data)
    this.isViewTest = false;
  }
 
  submitAnswer(){
    let payload ={
      "userId": this.launchTestData?.userId,
      "isStudent": this.launchTestData?.isStudent,
      "testName":this.launchTestData?.testName,
      "subject": this.launchTestData?.subject,
      "test": this.launchTestData?.test,
      "answeredBy": this.userDetails?.name,
      "regNo": this.userDetails?.regNo,
      "createdBy": this.launchTestData?.createdBy,
      "score":'',
      "reviewedBy": '',
    }
    this.apiService.updateTest(payload, this.launchTestData?._id).subscribe(res =>{
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
  back(){
    this.router.navigate(["home"])
  }

  startService(){
    this.service.start()
  }

  stopService(){
    this.service.stop()
  }

  speakText(){
    this.synth = window.speechSynthesis;
      let welcomeText = 'Hi.. Welcome to Mission for Vision, I am your voice Assistant.. How may I help you?'
      const utterance = new SpeechSynthesisUtterance(welcomeText);
      this.synth.speak(utterance);
  }

}
