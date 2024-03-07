// @ts-check

import { addSwitchAnimation } from "./core/animation.js";
import Component from "./core/component.js";

import './service/timer/ui.js';
import './components/widget.js';

class Screen3 extends Component {
  render() {
    this.innerHTML = `
      <section id="screen3">
        <app-timer-rect></app-timer-rect>
      </section>
    `;
  }

  afterMount() {

  }
}


class Screen2 extends Component {
  render() {
    this.innerHTML = `
      <section id="screen2">
      IOS STANDBY
      </section>
    `;
  }
}

class Screen1 extends Component {
  render() {
    this.innerHTML = `
      <section id="screen1">
        <app-timer-circle></app-timer-circle>
        <app-widget></app-widget>
      </section>
    `;
  }
}

class App extends Component {
  render() {
    this.innerHTML = `
      <div id="app">
        <app-screen3></app-screen3>
        <app-screen1></app-screen1>
        <app-screen2></app-screen2>
      </div>
    `;
  }

  afterMount() {
    const app = /** @type {HTMLElement} */ (this.querySelector("#app"));

    addSwitchAnimation(app, 'horizontal');
  }
}

customElements.define('app-screen3', Screen3);

customElements.define('app-screen2', Screen2);

customElements.define('app-screen1', Screen1);

customElements.define('app-root', App);