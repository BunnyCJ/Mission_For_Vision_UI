import { Component } from '@angular/core';
import { VoiceRecognitionService } from '../service/voice-recognition.service';
declare var webkitSpeechRecognition: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  text: any;
  synth: any;
  recognition =  new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  tempWords: any;
  constructor(
    public service : VoiceRecognitionService
  ) { 
   }
   ngOnInit(): void {
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
    this.listenAudio()
  }
  isFullName: boolean = false;
  fullName: any='';
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
        }else if( this.text.includes('register form')){
          this.recognition.stop();
          this.isRegistrationForm = true;
          this.speakTexts('registration');
        }else if(this.isRegistrationForm){
          if(this.isFullName){
            let pattern = /^[a-zA-Z ]+$/
            if(this.text !== '' && this.text.length > 1 && !pattern.test(this.text)){
              let value = this.text.split('.')
              this.fullName = value[0]
              console.log(this.fullName)
              this.speakTexts('fullNameSaved');
            }else{
              this.text='';
              this.speakTexts('fullNameError');
            }
          }else if(this.isAge){
            let pattern = /^[0-9]+$/;
            // setTimeout(() =>{
              if(this.text !== ''){
                let value = this.text.split('.')
                this.age = value[0]
                console.log(this.text)
                this.stop();
                this.speakTexts('ageSaved');
              }else{
                this.text='';
                this.stop();
                this.speakTexts('ageError');
              }
            // }, 1000)
           
          }else if(this.isGender){
            if(this.text !== ''){
            // if( this.text.includes('male') || this.text.includes('female')){
              let value = this.text.split('.')
              this.gender = value[0]
              this.speakTexts('genderSaved');
            }else{
              this.text='';
              this.speakTexts('genderError');
            }
          }else if(this.isPassword){
            if(this.text !== '' && this.text.length > 1){
              let value = this.text.split('.')
              this.password = value[0]
              this.speakTexts('passwordSaved');
            }else{
              this.text='';
              this.speakTexts('passwordError');
            }
          }else if(this.isCpassword){
            if(this.text !== '' && this.text.length > 1){
              let value = this.text.split('.')
              this.age = value[0]
              this.speakTexts('cPasswordSaved');
            }else{
              this.text='';
              this.speakTexts('cPasswordError');
            }
          }
        }
        else{
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


  isRegistrationForm: boolean = false;
  isAge: boolean = false;
  age: any
  gender: any;
  isGender : boolean = false;
  password: any;
  cPassword : any;
  isCpassword: boolean = false
  isPassword : boolean = false;
  async speakTexts(load: any):Promise<any> {
    if(!this.isRegistrationForm){// Check if the speechSynthesis API is available in the browser
      if ('speechSynthesis' in window) {
        // Create a SpeechSynthesisUtterance object
        const speech = new SpeechSynthesisUtterance('Hello, world!');
      
        // Optionally, set voice and other properties
        // const voices = window.speechSynthesis.getVoices();
        // speech.voice = voices[0]; // Use the first available voice
      
        // Speak the text
        window.speechSynthesis.speak(speech);
      
        // Handle the 'end' event to know when speech is finished
        speech.onend = (event) => {
          console.log('Speech synthesis finished.', event);
        };
        this.synth = window.speechSynthesis;
      let welcomeText = 'Hi.. Welcome to Mission for Vision, I am your voice Assistant.. How may I help you?'
      const utterance = new SpeechSynthesisUtterance(welcomeText);
      this.synth.speak(utterance);
      } 
    }else{
      if(load == 'registration'){
        let formOpenedText = '...Sure.., Registration form is opened. please tell me your full name'
        const utterance = new SpeechSynthesisUtterance(formOpenedText);
        this.synth.speak(utterance);
        this.isFullName = true;
        this.text =''
        setTimeout(() => {
          this.start();
        }, 4000);
      }else if(load== 'fullNameSaved'){
        let Text = `Name ${this.fullName} is Saved... tell me your age`
        const utterance = new SpeechSynthesisUtterance(Text);
        this.synth.speak(utterance);
        this.isAge = true;
        this.isFullName = false;
        this.text =''
        setTimeout(() => {
          this.start();
        }, 4000);
      }else if(load == 'fullNameError'){
        let Text = `Please tell me a valid full name`
        const utterance = new SpeechSynthesisUtterance(Text);
        this.synth.speak(utterance);
        this.isFullName = true;
        this.text=''
        setTimeout(() => {
          this.start();
        }, 4000);
      }else if(load== 'ageSaved'){
        let Text = `Age ${this.age} is Saved... tell me your Gender`
        const utterance = new SpeechSynthesisUtterance(Text);
        this.synth.speak(utterance);
        this.isAge = false;
        this.isFullName = false;
        this.isGender= true;
        this.text=''
        setTimeout(() => {
          this.start();
        }, 4000);
      }else if(load == 'ageError'){
        let Text = `Please tell me a valid age `
        const utterance = new SpeechSynthesisUtterance(Text);
        this.synth.speak(utterance);
        this.isAge = true;
        this.isFullName = false;
        this.text=''
        setTimeout(() => {
          this.start();
        }, 4000);
      }else if(load== 'genderSaved'){
        let Text = `Gender ${this.gender} is Saved... tell me your password`
        const utterance = new SpeechSynthesisUtterance(Text);
        this.synth.speak(utterance);
        this.isAge = false;
        this.isFullName = false;
        this.isGender= false;
        this.isPassword = true;
        this.text=''
        setTimeout(() => {
          this.start();
        }, 4000);
      }else if(load == 'genderError'){
        console.log(this.text)
        let Text = `Please tell me valid gender`
        const utterance = new SpeechSynthesisUtterance(Text);
        this.synth.speak(utterance);
        this.isAge = false;
        this.isFullName = false;
        this.isGender = true;
        this.text=''
        setTimeout(() => {
          this.start();
        }, 4000);
    }else if(load== 'passwordSaved'){
      let Text = `password ${this.password} is Saved... tell me your password again for confirmation`
      const utterance = new SpeechSynthesisUtterance(Text);
      this.synth.speak(utterance);
      this.isAge = false;
      this.isFullName = false;
      this.isGender= false;
      this.isPassword = false;
      this.isCpassword = true;
      this.text=''
      setTimeout(() => {
        this.stop();
      }, 4000);
    }else if(load == 'cPasswordError'){
      let Text = `password did not match.. please tell the confirm password again`
      const utterance = new SpeechSynthesisUtterance(Text);
      this.synth.speak(utterance);
      this.isAge = false;
      this.isFullName = false;
      this.isGender = false;
      this.isPassword = false;
      this.isCpassword = true; 
      this.text=''
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
