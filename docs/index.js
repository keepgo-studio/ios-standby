// @ts-check

import { API } from './app/service/api.js';
import { Geo } from './app/service/geo/geo.js';
import { Timer } from './app/service/timer/timer.js';
import { Weather } from './app/service/weather/weather.js';
import { Internet } from './app/service/internet/internet.js';

import './app/app.js';

const root = document.getElementById("root");

window.onload = () => {
  Internet.on();
  Timer.on();
  Geo.on();
  Weather.on();

  API.checkFirebase();
  
  if (root) root.innerHTML = '<app-root></app-root>';
}

