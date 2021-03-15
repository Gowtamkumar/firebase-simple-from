import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';



if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}
function App() {

  const [newUser, setnewUser] = useState(false)
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    error: '',
    success: ''
  })


  const HeandelChange = (event) => {
    let idfielddate = true;
    if (event.target.name === 'email') {
      const emailvalitation = /\S+@\S+\.\S+/.test(event.target.value)
      idfielddate = event.target.value && emailvalitation;

    }
    if (event.target.name === 'password') {
      const ispassword = event.target.value.length > 6;
      const emailvalitation = /\d{1}/.test(event.target.value)
      idfielddate = ispassword && emailvalitation;

    }
    if (idfielddate) {
      const newUserinfo = { ...user }
      newUserinfo[event.target.name] = event.target.value;
      setUser(newUserinfo);
    }
  }

  const HandelSubmit = (event) => {
    console.log(user, user.password);
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          // Signed in 
          const newUserinfo = { ...user }
          newUserinfo.error = '';
          newUserinfo.success = true;
          setUser(newUserinfo);
          updateUserinfo(user.name);
          console.log('user info ', res.user)
        })
        .catch(error => {
          const newUserinfo = { ...user }
          newUserinfo.error = error.message;
          newUserinfo.success = false;
          setUser(newUserinfo)
        });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          // Signed in
          const newUserinfo = { ...user }
          newUserinfo.error = '';
          newUserinfo.success = true;
          setUser(newUserinfo)
          console.log("DSAFADS", user)
        })
        .catch((error) => {
          const newUserinfo = { ...user }
          newUserinfo.error = error.message;
          newUserinfo.success = false;
          setUser(newUserinfo)
        });
    }
    event.preventDefault();

  }
  const updateUserinfo = name => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function () {
      console.log('User name Update successful.')
    }).catch(function (error) {
      console.log(error)
    });
  }



  var Googleprovider = new firebase.auth.GoogleAuthProvider();
  const HandelGooglesignin = () => {
    firebase.auth()
      .signInWithPopup(Googleprovider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        setUser(user)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(error)
        // ...
      });
  }
  var Facebookprovider = new firebase.auth.FacebookAuthProvider();
  const HandelFacebooksignin = () => {
    firebase
      .auth()
      .signInWithPopup(Facebookprovider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;
        setUser(user)
        
      })
      .catch((error) => {
        console.log(error)
       
      });

  }
  var Githubprovider = new firebase.auth.GithubAuthProvider();
  const HandelGithubsignin = () => {
    firebase
      .auth()
      .signInWithPopup(Githubprovider)
      .then(result => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        var token = credential.accessToken;

        // The signed-in user info.
        var user = result.user;

        setUser(user)

        // ...
      }).catch(error => {
        // // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // // The email of the user's account used.
        // var email = error.email;
        // // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // ...
        console.log(error)
      });
  }

  return (
    <div className="App">
      <div className="main-container">
        <button onClick={HandelGooglesignin}>Sign in By Google</button><br />
        <button onClick={HandelFacebooksignin}>Sign in By facebook</button><br />
        <button onClick={HandelGithubsignin}>Sign in By Github</button><br />

        <form onSubmit={HandelSubmit}>
          <input type="checkbox" name="newUser" id="" onChange={() => setnewUser(!newUser)} />
          <label htmlFor="newUser">New Sign Up</label><br />
          {newUser && <input type="text" name="name" onBlur={HeandelChange} placeholder="Your name" />}<br />
          <input type="email" name="email" onBlur={HeandelChange} placeholder="Your Email" required /><br />
          <input type="password" name="password" onBlur={HeandelChange} placeholder="Your Password" required /><br />
          <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
        </form>
        <p style={{ color: 'red' }}>{user.error}</p>
        {user.success && <p style={{ color: 'green' }}>New User {newUser ? 'Create' : 'Logged in'} successfully</p>}

        <p>Display Name: {user.displayName}</p>
        <p>Email: {user.email}</p>
        <p>Password: {user.password}</p>
        <img src={user.photoURL} alt="" />
      </div>
    </div>
  );
}

export default App;
