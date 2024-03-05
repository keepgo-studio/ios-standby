import './app/app.js';
import { API } from './app/service/api.js';


const root = document.getElementById("root");

window.onload = async () => {
  await API.checkFirebase();
  
  root.innerHTML = '<app-root></app-root>';
}

