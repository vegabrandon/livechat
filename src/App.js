
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBL4nn6jSK74RS1pqm8L9ukATs4UB3Crv4",
  authDomain: "livechat-a4a50.firebaseapp.com",
  projectId: "livechat-a4a50",
  storageBucket: "livechat-a4a50.appspot.com",
  messagingSenderId: "789680953873",
  appId: "1:789680953873:web:8d6401851a67f6c4e02fb0",
  measurementId: "G-9V3TXS167Q"
})
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App container">

      <section className='row'>
        <h1 className='display-2'>LiveChat</h1>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button className='btn btn-dark col-3' onClick={signInWithGoogle}> Sign in with Google</button>
  )
}
function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()} className='btn btn-dark col-2 my-4'>Sign Out</button>

  )
}
function ChatRoom() {
  const messagesReference = firestore.collection('messages');
  const query = messagesReference.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');
  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesReference.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
  }

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit" className='btn btn-dark mx-2'>Send Message</button>
      </form>
      <div className='col-5'></div>
      <SignOut />
      <div className='col-5'></div>
    </>
  )
  function ChatMessage(prop) {
    const { text, uid, photoURL } = prop.message;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt="" />
        <p>{text}</p>
      </div>
    )
  }
}

export default App;
