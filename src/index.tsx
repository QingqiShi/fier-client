import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { RouteProvider } from 'libs/route-provider';

firebase.initializeApp({
  apiKey: 'AIzaSyA9BuwuC9WcEGgCB60wVrph_AEM0oPsBO4',
  authDomain: 'fier-app.firebaseapp.com',
  databaseURL: 'https://fier-app.firebaseio.com',
  projectId: 'fier-app',
  storageBucket: 'fier-app.appspot.com',
  messagingSenderId: '136802262330',
  appId: '1:136802262330:web:178fefc9383280c6'
});

const db = firebase.firestore();
console.log(db);

ReactDOM.render(
  <Router>
    <RouteProvider>
      <App />
    </RouteProvider>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
