import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyAQ3J3pivlY_L1qZ9yysqrprq62XuuBGHE',
  authDomain: 'shiqingqi-27cab.firebaseapp.com',
  databaseURL: 'https://shiqingqi-27cab.firebaseio.com',
  projectId: 'shiqingqi-27cab',
  storageBucket: 'shiqingqi-27cab.appspot.com',
  messagingSenderId: '207610618557',
  appId: '1:207610618557:web:5abaa249cf9fb826'
});

const db = firebase.firestore();
console.log(db);

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
