import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import *as Permissions from 'expo-permissions';
import firebase from 'firebase';
import db from "./config.js";

export default class transaction extends React.Component{
    constructor(){
        super();
        this.state = {
            hasCameraPermissions:null,
            scanned:false,
            scannedData:'',
            buttonState:'normal',
        }
    }

    getCameraPermission = async ()=>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermissions:state==="granted",
            buttonState:'clicked',
            scannned:false,
        })
    }

    handleBarCodeScanned = async({type,data})=>{
         this.setState({
             scanned:true,
             scannedData:data,
             buttonState:'normal',
             
         })
    }
    initiateBookIssue = async ()=>{
      //add a transaction
      db.collection("transaction").add({
        'studentId' : this.state.scannedStudentId,
        'bookId' : this.state.scannedBookId,
        'data' : firebase.firestore.Timestamp.now().toDate(),
        'transactionType' : "Issue"
      })
  
      //change book status
      db.collection("books").doc(this.state.scannedBookId).update({
        'bookAvailability' : false
      })
      //change number of issued books for student
      db.collection("students").doc(this.state.scannedStudentId).update({
        'numberOfBooksIssued' : firebase.firestore.FieldValue.increment(1)
      })
  
      this.setState({
        scannedStudentId : '',
        scannedBookId: ''
      })
    }
  
    initiateBookReturn = async ()=>{
      //add a transaction
      db.collection("transactions").add({
        'studentId' : this.state.scannedStudentId,
        'bookId' : this.state.scannedBookId,
        'date'   : firebase.firestore.Timestamp.now().toDate(),
        'transactionType' : "Return"
      })
  
      //change book status
      db.collection("books").doc(this.state.scannedBookId).update({
        'bookAvailability' : true,
         
      })
  
      //change book status
      db.collection("students").doc(this.state.scannedStudentId).update({
        'numberOfBooksIssued' : firebase.firestore.FieldValue.increment(-1)
      })
  
      this.setState({
        scannedStudentId : '',
        scannedBookId : ''
      })
    }
    handleTransaction =()=>{
        var transactionMessage = null
        db.collection("books").doc(this.state.scannedBookID).get()
        .then((doc) =>{
          var book = doc.data()
          if (book.bookAvailability){
           this.initiateBookIssue()
           transactionMessage = "Book Issued"
          }
          else{
            this.initiateBookReturn()
            transactionMessage = "Book Returned"
          }
          console.log(doc.data())
        })
        
    }

   render(){
       const hasCameraPermissions = this.state.hasCameraPermissions
       const scanned = this.state.scanned
       const buttonState = this.state.buttonState
       if(buttonState==="clicked"&&hasCameraPermissions){
           return(
               <BarCodeScanner
               onBarCodeScanned = {scanned?undefined:this.handleBarCodeScanned}
               style = {StyleSheet.absoluteFillObject}

               />
           )
       }
       else if (buttonState === "normal"){
        return(
          <View style={styles.container}>
            <View>
              <Image
                source={require("../assets/booklogo.jpg")}
                style={{width:200, height: 200}}/>
              <Text style={{textAlign: 'center', fontSize: 30}}>KarKarKarthik</Text>
            </View>
            <View style={styles.inputView}>
            <TextInput 
              style={styles.inputBox}
              placeholder="Book Id"
              value={this.state.scannedBookId}/>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={()=>{
                this.getCameraPermissions("BookId")
              }}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.inputView}>
            <TextInput 
              style={styles.inputBox}
              placeholder="Student Id"
              value={this.state.scannedStudentId}/>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={()=>{
                this.getCameraPermissions("StudentId")
              }}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}>
              <Text style={styles.submitButtonText}>
                You Better Submit This Or Else Your Tea Will Not Be Hot, But COLD.
              </Text>
              onPress = {async()=>{
                  var transactionMessage = await this.handleTransaction();
              }
            }
            </TouchableOpacity>
            </View>
          </View>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10
    },
    inputView:{
      flexDirection: 'row',
      margin: 20
    },
    inputBox:{
      width: 200,
      height: 40,
      borderWidth: 1.5,
      borderRightWidth: 0,
      fontSize: 20
    },
    scanButton:{
      backgroundColor: '#66BB6A',
      width: 50,
      borderWidth: 1.5,
      borderLeftWidth: 0
    },
    submitButton:{
      backgroundColor: '#FBC020',
      width:100,
      height:50,
    },
    submitButtonText:{
      padding:10,
      textAlign:'center',
      alignSelf:'center',
      textSize:20,
      fontWeight:'bold',
      color:'white'
    }
  });