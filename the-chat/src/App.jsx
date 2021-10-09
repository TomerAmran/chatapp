import './App.css';
import React, { useState } from 'react'
// Import the functions you need from the SDKs you need
import firebase from 'firebase/app'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'
require('firebase/firestore')
require('firebase/auth')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7ho27g_GupQDshYpBQSfmwHEN6Nh1xtQ",
  authDomain: "chatapp-30a7c.firebaseapp.com",
  projectId: "chatapp-30a7c",
  storageBucket: "chatapp-30a7c.appspot.com",
  messagingSenderId: "592755141332",
  appId: "1:592755141332:web:0e7d3694c90d826eaca941",
  measurementId: "G-HGTEE7RM3K"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = new firebase.auth(app)
const firestore = firebase.firestore()

function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <section>
      {user? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}


function SignIn(){
  console.log('signin')
  function signInWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }
  return (
    <button style={{backgroundColor:'green'}} onClick={signInWithGoogle}>log in</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={async ()=> await app.auth().signOut()}>Sign Out</button>
  )
}
/*
interface Message {
  id: string,
  user_id:string
  text: string,
  date: Date
}
*/
function ChatRoom(){
  console.log('chat room')
  const messagesRef = firestore.collection('messages').orderBy('createdAt').limit(10)
  const query = messagesRef
  const [messages] = useCollectionData(query,{idField:'id'})
  console.log(messages)
  return (
    <div>
      <SignOut/>
      {messages && messages.map(m=>
        (<ChatMessage key={m.id} msg={m}/>)
      )}
      <Input/>
    </div>
  )
}

function Input(){
  const [formValue, setFormValue] = useState('') 

  const messagesRef = firestore.collection('messages')
const sendMessage = async (e)=>{
  e.preventDefault()
  const {uid} = auth.currentUser
  await messagesRef.add({
    user_id:uid,
    text: formValue,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  setFormValue('')
}

  return (
    <>
<form action="text-input" onSubmit={sendMessage}>
  <input type="text" id="lname" name="lname" value={formValue}
   onChange={e=>{setFormValue(e.target.value)}}/>
  <input type="submit" value="Submit"/>
</form> 
    </>
  )
}
function ChatMessage({msg}){

  const messageClass = msg.user_id === auth.currentUser.uid ? 'sent' :'recived'
  return (
  <div style={{backgroundColor: messageClass === 'sent' ? 'green' : 'red'}}>
    <p>{msg.text}</p>
  </div>
)
}

export default App;
