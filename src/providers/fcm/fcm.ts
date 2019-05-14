import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication';
import { AuthServiceProvider } from '../auth-service/auth-service';
import { HttpServiceProvider } from '../http-service/http-service';


@Injectable()
export class FcmProvider {

  token;
  dispositivos = [];
  constructor(
    public firebaseNative: Firebase,
    public firestore: AngularFirestore,
    private platform: Platform,
    private firebaseAuth:FirebaseAuthentication,
    private http:HttpServiceProvider
  ) {

    firebase.auth().onAuthStateChanged(
      user=>{
        if(user)
        {
          console.log('Still logged in')
        }
        else{
          console.log('Logged out')
        }
      }
    );
    // this.firebaseAuth.onAuthStateChanged()
    //   .subscribe(
    //     user=>{
    //     if(user)
    //     {
    //       console.log('Still logged in');
    //     }
    //     else{
    //       console.log('Logged out');
    //     }
    //   }
    // );
  }

  // Get permission from the user
  async getToken() {

    let token;
  
    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken();
      
    } 
  
    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    } 
    this.token = token;
    return this.saveTokenToFirestore(token);
  }

  // Save the token to firestore
  private saveTokenToFirestore(token) {
    if (!token) return;
    const devicesRef = this.firestore.collection<any>('devices');
  
    const docData = { 
      token,
      userId: firebase.auth().currentUser.uid,
      
    };
    this.updateDispositivosList();
    return devicesRef.doc(token).set(docData);
  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen();
  }


 
  firebaseLogin(firebaseUser){
       firebase.auth().signInWithEmailAndPassword(firebaseUser.email, firebaseUser.password)
        .then(
          ()=>{
              // Get a FCM token
              
              this.getToken();
          }
        )
        .catch(
          error=>{
            console.log("ERROR NO LOGIN FIREBASE = " , error)
          }
        )
  }
  firebaseCreateUser(firebaseUser){
        firebase.auth().createUserWithEmailAndPassword(firebaseUser.email, firebaseUser.password)
        .then(
          ()=>this.firebaseLogin(firebaseUser)
        )
        .catch(
          error=>{
            console.log("ERROR NO CREATE USER FIREBASE = " , error);
            this.firebaseLogin(firebaseUser);
          }
        )
  }
    

  async firebaseSignOut(){
    
    const devicesRef = this.firestore.collection<any>('devices');
    
    await devicesRef.doc(this.token).delete()
      .then(
        data=>{
          
          
        }
      );
    await this.updateDispositivosList()
    .then(
      ()=>{
        firebase.auth().signOut();
      }
    );
  }
    
  async updateDispositivosList(){
    this.dispositivos = [];
    let db = firebase.firestore();
    let devicesRef = db.collection('devices').where('userId',"==",firebase.auth().currentUser.uid)
    let result = await devicesRef.get();
    result.forEach(
      data=>{
        let dispositivo = data.data().token;
        this.dispositivos.push(dispositivo);
      }
    );
    this.updateDevices();
  }

   updateDevices(){
    let urn = "/dispositivo";
    let body = {
      "dispositivos":this.dispositivos
    }

    this.http.post(urn,body)
      .subscribe(
        ()=>{
          console.log("Success");
        },
        error=>{
          console.log("Failed",error);
        }
      
      );
   }
    

  }
    