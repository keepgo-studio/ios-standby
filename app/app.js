// @ts-check

import { addSwitchAnimation } from "./core/animation.js";
import Component from "./core/component.js";
import { Timer } from "./timer/timer.js";

import './timer/ui.js';

class Screen2 extends Component {
  render() {
    this.innerHTML = `
      <section id="screen2">
      2
      </section>
    `;
  }
}

class Screen1 extends Component {
  render() {
    this.innerHTML = `
      <section id="screen1">
        <app-timer-circle></app-timer-circle>
        <!-- TODO widget ui -->
      </section>
    `;
  }
}

class App extends Component {
  render() {
    this.innerHTML = `
      <div id="app">
        <app-screen1></app-screen1>
        <app-screen2></app-screen2>
      </div>
    `;
  }
  setup() {
    // [ ] turn on weather
    // [ ] turn on geo
    // [x] turn on timer
    Timer.on();
  }

  connectedCallback() {
    const app = /** @type {HTMLElement} */ (this.querySelector("#app"));

    // [x] turn on animation
    addSwitchAnimation(app);
  }
}

customElements.define('app-screen2', Screen2);

customElements.define('app-screen1', Screen1);

customElements.define('app-root', App);