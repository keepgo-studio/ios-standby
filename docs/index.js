// @ts-check

import { API } from './app/service/api.js';
import { Geo } from './app/service/geo/geo.js';
import { Timer } from './app/service/timer/timer.js';

// [ ] customElements 한 곳에 모으기
// [ ] 모바일 최적화
import './app/app.js';
import { Weather } from './app/service/weather/weather.js';

const root = document.getElementById("root");

window.onload = () => {
  Timer.on();
  Geo.on();
  Weather.on();

  API.checkFirebase();
  
  if (root) root.innerHTML = '<app-root></app-root>';
}

