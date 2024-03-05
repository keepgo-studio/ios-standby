// @ts-check

import { addSwitchAnimation } from "./core/animation.js";
import Component from "./core/component.js";

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
      1
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
    // [ ] turn on timer
  }

  connectedCallback() {
    /** @type {HTMLElement | null} */
    const app = this.querySelector("#app");

    if (app) {
      // [x] turn on animation
      addSwitchAnimation(app);
    }
  }
}

customElements.define('app-screen2', Screen2);

customElements.define('app-screen1', Screen1);

customElements.define('app-root', App);