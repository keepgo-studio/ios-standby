// @ts-check

import { IOS_SVG } from "../../vars.js";
import { addSwitchAnimation } from "../core/animation.js";
import Component from "../core/component.js";


class Home extends Component {
  _temp;
  _weather;
  _region;

  render() {
    this.innerHTML = `
      <section id="widget-home">
        <header>
          <span>${'대구 광역시'}</span>
          ${IOS_SVG.location}
        </header>
        
        <div class="temp">
          <p>${'7'}°</p>
        </div>

        <div class="weather">
          <img src=${'/static/weather/cloud.fog.fill.png'} />
          <p>${'흐림'}</p>
          <p><span>최고: ${8}°</span><span>최저: ${5}°</span></p>
        </div>
      </section>
    `;
  }

  connectedCallback() {
    // [ ] temp subscribe

    // [ ] weather subscribe
  }
}

class Internet extends Component {

}


class Widget extends Component {
  render() {
    this.innerHTML = `
      <seciton id="widget">
        <div class="container">
          <app-home-widget></app-home-widget>
          <app-internet-widget></app-internet-widget>
        </div>
      </seciton>
    `;
  }

  connectedCallback() {
    const container = /** @type {HTMLElement} */ (this.querySelector("#widget > .container"));

    addSwitchAnimation(container, 'vertical', true);
  }
}

customElements.define('app-home-widget', Home);

customElements.define('app-inernet-widget', Internet);

customElements.define('app-widget', Widget);