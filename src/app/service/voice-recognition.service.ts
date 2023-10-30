import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {
  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords: any;
  public name = '';
  public subject = '';
  public question = '';
  public isTestPage: boolean = false;
  constructor(private router: Router,private route: ActivatedRoute) { }

  init() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
      console.log(transcript);
    });
  }

  start() {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log("Speech recognition started")
    this.recognition.addEventListener('end', (condition: any) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log("End speech recognition")
      } else {
        this.wordConcat()
        this.recognition.start();
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
    console.log(this.text)
      if (this.tempWords?.includes("test")) {
        this.name = this.tempWords?.replace("test", "").trim();
      }else if (this.tempWords?.includes("subject")) {
        this.subject = this.tempWords?.replace("subject", "").trim();
      }else if (this.tempWords?.includes("question")) {
        this.question = this.tempWords?.replace("question", "").trim();
      }
      else if (this.tempWords?.includes("submit test")) {
       // this.text ='';
       this.stop();
        // this.router.navigate(['/test']);
      }
    this.tempWords = '';
  }

}
