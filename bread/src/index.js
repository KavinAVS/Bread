import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import { FirebaseProvider } from "./firebase";

ReactDOM.render(
  <React.StrictMode>
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
