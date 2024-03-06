// @ts-check

import { delay } from "../../utils.js";
import { IOS_SVG, WEATHER_CODE } from "../../vars.js";
import { addSwitchAnimation, iosFadeIn, iosFadeOut } from "../core/animation.js";
import Component, { SubscribeComponent } from "../core/component.js";
import { Geo } from "../service/geo/geo.js";
import { Weather } from "../service/weather/weather.js";

class Home extends SubscribeComponent {
  render() {
    this.innerHTML = `
      <section id="widget-home">
        <header>
          --
        </header>
        
        <div class="temp">
          <p></p>
        </div>

        <div class="weather">
          <img />
          <p class="desc"></p>
          <p class="min-max"></p>
        </div>
      </section>
    `;
  }

  afterMount() {
    const tempElem = /** @type {Element} */ (this.querySelector("#widget-home > .temp"));
    const headerElem = /** @type {Element} */ (this.querySelector("#widget-home header"));
    const weatherImgElem = /** @type {HTMLImageElement} */ (this.querySelector("#widget-home img"));
    const weatherDescElem = /** @type {Element} */ (this.querySelector("#widget-home .desc"));
    const weatherMinMaxElem = /** @type {Element} */ (this.querySelector("#widget-home .min-max"));

    this.addSubscribeHandler("weather/update", (e) => {
      const { temp, temp_max, temp_min } = e.detail.main;

      const renderTemp = async () =>  {
        if (temp === null) return;

        iosFadeOut(tempElem);
        await delay();
        tempElem.innerHTML = `
          <span>${Math.round(temp)}°</span>
        `;
        iosFadeIn(tempElem);
      }

      const renderWeatherImg = async () => {
        try {
          const { icon } = e.detail.weather[0];

          iosFadeOut(weatherImgElem);
          await delay();
          weatherImgElem.src = `./static/weather/${WEATHER_CODE[icon]}`;
          iosFadeIn(weatherImgElem);
        } catch {};
      }
      const renderWeatherDesc = async () => {
        try {
          const { description } = e.detail.weather[0];

          iosFadeOut(weatherDescElem);
          await delay();
          weatherDescElem.innerHTML = `
            <span>${description}</span>
          `;
          iosFadeIn(weatherDescElem);
        } catch {};
      }
      const renderWeatherMinMax = async () => {
        if (temp_min === null || temp_max === null) return;

        iosFadeOut(weatherMinMaxElem);
        await delay();
        weatherMinMaxElem.innerHTML = `
          <span>max: ${Math.round(temp_max)}°</span>  
          <span>min: ${Math.round(temp_min)}°</span>
        `;
        iosFadeIn(weatherMinMaxElem);
      }

      Promise.all([
        renderWeatherImg(),
        renderTemp(),
        renderWeatherDesc(),
        renderWeatherMinMax()
      ])
    });

    Weather.subscribe(this);

    this.addSubscribeHandler("geo/update", async (e) => {
      const { name, local_names } = e.detail;

      if (name === null || local_names === null) return;
      
      const text = local_names[navigator.language] ?? name;

      iosFadeOut(headerElem);
      await delay();
      headerElem.innerHTML = `
        <span>${text}</span> ${IOS_SVG.location}
      `;
      iosFadeIn(headerElem);
    });

    Geo.subscribe(this);
  }
}

class Internet extends Component {
  render() {
    this.innerHTML = `
      <section id="widget-internet">

      </section>
    `;
  }
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

  afterMount() {
    const container = /** @type {HTMLElement} */ (this.querySelector("#widget > .container"));

    addSwitchAnimation(container, 'vertical', true);
  }
}

customElements.define('app-home-widget', Home);

customElements.define('app-inernet-widget', Internet);

customElements.define('app-widget', Widget);