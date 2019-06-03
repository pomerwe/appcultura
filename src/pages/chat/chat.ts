import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  initialScrollHeight = 0;
  textAreaText='';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private keyboard: Keyboard
    ) {
  }

  ionViewDidLoad() {
    this.setHiddenTextArea();
    this.initialScrollHeight = document.getElementById('textarea').scrollHeight;
    setTimeout(()=>{this.scrollBottom()},150);
  }
  scrollBottom(){
    document.getElementById('messagesScroll').scrollTop = (document.getElementById('messagesScroll').scrollHeight);

  }
  scrollTop(height?){
    let maxScroll = document.getElementById('messagesScroll').scrollHeight;
    let scrollHeight = height != undefined ? height : maxScroll;
    document.getElementById('messagesScroll').scrollTop = scrollHeight;
    scrollHeight = scrollHeight - 30;
    setTimeout(()=>{
      if(scrollHeight < maxScroll) this.scrollTop(scrollHeight);
    },15);

  }
  inputText(divInput,textarea,hiddenTextArea){  
    document.getElementById('textarea').scrollTop = (document.getElementById('textarea').scrollHeight);
    let height = (hiddenTextArea.scrollHeight);
    
    let maxHeight = this.initialScrollHeight *4;
    if(height<=maxHeight){
      textarea.style.height = `${height}px`;
      //divInput.style.marginTop = `${height}px`;
    }
    else{
      textarea.style.height = `${maxHeight}px`;
      //divInput.style.marginTop = `${maxHeight}px`;
    }

    

  }
  inputBlur(divInput,textarea){
    let height = (this.initialScrollHeight);
    textarea.style.height = `${height}px`;
    divInput.style.marginTop = `${height}px`;
    document.getElementById('textarea').scrollTop = (document.getElementById('textarea').scrollHeight);
  }
  inputFocused(ioncontent){
    this.keyboard.onKeyboardShow()
      .subscribe(
        data => {
          document.getElementById('chatContainer').style.marginBottom = `${data.keyboardHeight}px`;
          ioncontent._scrollContent.nativeElement.scrollTop = (ioncontent._scrollContent.nativeElement.scrollHeight);
          
        }
      );

    this.keyboard.onKeyboardHide()
        .subscribe(
          data=>{
            document.getElementById('chatContainer').style.marginBottom = `0px`;
          }
        );
    
   
  }
  setHiddenTextArea(){
    document.getElementById('hiddenTextArea').style.width = `${document.getElementById('textarea').offsetWidth}px`;
    document.getElementById('hiddenTextArea').style.height = `${document.getElementById('textarea').scrollHeight}px`;
  }

}
