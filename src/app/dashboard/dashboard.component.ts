import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { exportService } from '../service/export.service';
import { VoiceReco2Service } from '../service/voice-reco2.service';
import { VoiceRecognitionService } from '../service/voice-recognition.service';
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

isStudent : boolean = true;
addTestName: any;
addSubject: any;
addQuestion: any =[];
userDetails: any;
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
testDetails: any;
userData:any;
studentCount: any;
synth: any;

@Output() closeModal: EventEmitter<void> = new EventEmitter<void>();


  constructor(
    private router : Router,
    private apiService : ApiService,
    private toastr : ToastrService,
    private logService : exportService, 
    public service : VoiceRecognitionService,

  ){}


  ngOnInit(): void {
    this.getUserDetails();
    this.getStudents();
    this.getTests();
  }
  getUserDetails(){
    this.logService.getUserDetails().subscribe(res =>{
      this.userDetails = res;
    })
  }

  navigateToStudents(){
    this.router.navigate(['admin/student'])
  }

  navigateToCreateTest(){
    this.router.navigate(['admin/'])
  }
  close() {
    this.closeModal.emit();
  }
  setViewSessionStorage(){
    let session = {
      "load" : 'view'
    }
    sessionStorage.setItem('viewTest', JSON.stringify(session));
  }

  setLaunchTestSessionStorage(d: any){
    let session = d
    sessionStorage.setItem('launchTest', JSON.stringify(session));
    this.router.navigate(['/test'])
  }

  createQuestion(){
    this.stopService();
    let val : any= [];
    val = this.addQuestion.split(',');
    let arr : any = [];
    val.forEach((d: any) =>{
      arr.push({
        question: d.replace(' ', ''),
        answer : ''
      })
    })
    let payload ={
      "userId": this.userDetails?.userId,
      "isStudent": this.userDetails?.isStudent,
      "testName": this.addTestName,
      "subject": this.addSubject,
      "test": arr,
      "answeredBy": "",
      "regNo": "",
      "createdBy": this.userDetails?.name,
      "score":"",
      "reviewedBy": "",
    }
    console.log(payload)
    this.apiService.createTest(payload).subscribe(res =>{
      console.log(res)
      this.toastr.success(res.message, '',{
        positionClass: 'toast-bottom-right',
        timeOut: 3000
      })
      this.getTests();
      this.addTestName = '';
      this.addSubject= '';
      this.addQuestion= '';
    },
    (err) =>{
      this.toastr.error('something went wrong', '',{
        positionClass: 'toast-bottom-right',
        timeOut: 3000
      })
    }
    )
  }

  getTests(){
    this.apiService.getTest().subscribe(res =>{
      this.testData = res;
      console.log(res)
      // for Students
      this.filteredTestData = this.testData.filter((d: any )=> d.regNo == this.userDetails?.regNo)
      console.log(this.filteredTestData)
      this.overallTestCount = this.filteredTestData?.length
      console.log(this.overallTestCount)
      let avg_value: any = 0;
      this.filteredTestData.forEach((d: any) =>{
        avg_value += d.score
      })
      this.avg_score = avg_value/this.overallTestCount;
      this.completedTestList = this.filteredTestData.filter((d: any)=> d.answeredBy)
      console.log(this.completedTestList)
      this.uncompletedTestList = this.filteredTestData.filter((d: any)=> !d.answeredBy)
      this.uncompletedTestCount = this.uncompletedTestList.length
      this.completedTestCount = this.overallTestCount - this.uncompletedTestCount;

      // for teachers
      this.testDataCount = res.length;
      let val : any =[];
      val = res.filter((d: any) => d.answeredBy)
      let reviewTestCount : any =[];
      reviewTestCount = res.filter((d: any) => d.answeredBy && !d.score)
      this.reviewTestCount = reviewTestCount.length
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

  navigatetoTest(){
    this.router.navigate(['/test'])
  }

  getStudents(){
    this.apiService.getUser().subscribe(res =>{
      this.userData =res;
      console.log(res)
      let val: any = [];
      val = this.userData.filter((d : any) => d.isStudent == true)
      console.log(val)
      this.studentCount = val.length;
    },
    (err) =>{
      this.toastr.error(err.message, '',{
        positionClass: 'toast-bottom-right',
        timeOut: 3000
      })
    }
    )
  }
  deleteTestObjId: any;
  openDeleteTestModal(data: any){
  this.deleteTestObjId = data._id
  }
  deleteTest(){
    this.apiService.deleteTest( this.deleteTestObjId ).subscribe(res =>{
      this.toastr.success('Test deleted successfully', '',{
        positionClass: 'toast-bottom-right',
        timeOut: 3000
      })
      this.getTests();
      this.deleteTestObjId='';
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
  /** Voice to Text */
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

  // startListening(){
  //   this.startService();
  //   this.addTestName = this.service.name;
  //   this.addSubject = this.service.subject;
  //   this.addQuestion = this.service.question;
  // }

  text: any;
  recognition =  new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  tempWords: any='';
  isFullName: boolean = false;
  fullName: any='';
  isCreateTest : boolean = false


  startListening(){
    this.isCreateTest= true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
      if(this.tempWords.includes('test') || this.tempWords.includes('testname') || this.tempWords.includes('test name') ){
        if(this.tempWords.includes('test')){
          this.tempWords = this.tempWords.split(' ').filter((word: any) => word !== 'test').join(' ');
          console.log('testing the voice' , this.tempWords)
        }
        if(this.tempWords.includes('testname')){
          this.tempWords = this.tempWords.split(' ').filter((word: any) => word !== 'testname').join(' ');
        }
        this.addTestName = this.tempWords
      }else if(this.tempWords.includes('subject')){
        this.tempWords = this.tempWords.split(' ').filter((word: any) => word !== 'subject').join(' ');
        this.addSubject = this.tempWords
      }else if(this.tempWords.includes('questions')|| this.tempWords.includes('question')){
        if(this.tempWords.includes('questions')){
          this.tempWords = this.tempWords.split(' ').filter((word: any) => word !== 'questions').join(' ');
        }
        if(this.tempWords.includes('question')){
          this.tempWords = this.tempWords.split(' ').filter((word: any) => word !== 'question').join(' ');
        }
        this.addQuestion = this.tempWords
      }else if(this.tempWords.includes('create exam')){
        this.createQuestion();
      }
      // else if(this.tempWords.includes('stop recording')){
      //   this.stop();
      // }
      console.log(transcript);
    });
    this.listenAudio()
  }


async start():Promise<any> {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log("Speech recognition started")
    this.recognition.addEventListener('end', (condition: any) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log("End speech recognition")
      } else {
        this.wordConcat()
        if(this.text.includes('stop')){
          this.recognition.stop();
        }else{
          this.recognition.start();
        }
      }
    });
  }
  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat()
    this.recognition.stop();
    console.log("End speech recognition")
  }

  wordConcat() {
    this.text = this.text + ' ' + this.tempWords + '.';
    this.tempWords = '';

  }

  async speakTexts(load: any):Promise<any> {
    if(!this.isCreateTest){// Check if the speechSynthesis API is available in the browser
      if ('speechSynthesis' in window) {
        // Create a SpeechSynthesisUtterance object
        const speech = new SpeechSynthesisUtterance('Hello, world!');
      
        // Speak the text
        window.speechSynthesis.speak(speech);
      
        // Handle the 'end' event to know when speech is finished
        speech.onend = (event) => {
          console.log('Speech synthesis finished.', event);
        };
        this.synth = window.speechSynthesis;
      let welcomeText = 'Hi.. Welcome to Mission for Vision, I am your voice Assistant..?'
      const utterance = new SpeechSynthesisUtterance(welcomeText);
      this.synth.speak(utterance);
      } 
    }else{
      if(load == 'Test name' || load == 'testname'){
        let formOpenedText = '...Sure.., Registration form is opened. please tell me your full name'
        const utterance = new SpeechSynthesisUtterance(formOpenedText);
        this.synth.speak(utterance);
        this.isFullName = true;
        this.text =''
        setTimeout(() => {
          this.start();
        }, 4000);
      }
    }
  }
async listenAudio(){
  try{
    const textToSpeech = await this.speakTexts('initial');
    console.log('text to speech')
    const startListening = await this.start();
  }catch{
    console.log('error from catch')
  }
}
}
