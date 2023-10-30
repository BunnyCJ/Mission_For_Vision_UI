import { Component, OnInit } from '@angular/core';
import { VoiceRecognitionService } from '../service/voice-recognition.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrls: ['./speech-to-text.component.css'],
  providers: [VoiceRecognitionService]
})
export class SpeechToTextComponent implements OnInit {

  text: any;
  synth:any;
  constructor(
    public service : VoiceRecognitionService,
    private router : Router
  ) { 
    this.service.init()
   }

  ngOnInit(): void {
   // this.speakText()
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

  naviagateToDash(){
    this.router.navigate(['home'])
  }

}
