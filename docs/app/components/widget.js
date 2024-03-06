// @ts-check

import { delay } from "../../utils.js";
import { IOS_INTERNET, IOS_STORE, IOS_SVG, WEATHER_CODE } from "../../vars.js";
import { addSwitchAnimation, iosFadeIn, iosFadeOut } from "../core/animation.js";
import Component, { SubscribeComponent } from "../core/component.js";
import { Geo } from "../service/geo/geo.js";
import { Internet } from "../service/internet/internet.js";
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

class Online extends SubscribeComponent {
  render() {
    this.innerHTML = `
      <section id="widget-internet">
        <div class="svg-wrapper"></div>

        <div class="text"></div>

        <div class="background"></div>
      </section>
    `;
  }

  afterMount() {
    const root = /** @type {Element} */ (this.querySelector("#widget-internet"));
    const background = /** @type {Element} */ (this.querySelector("#widget-internet .background"));
    const svgWrapperElem = /** @type {Element} */ (this.querySelector("#widget-internet .svg-wrapper"));
    const svgTextElem = /** @type {Element} */ (this.querySelector("#widget-internet .text"));

    this.addSubscribeHandler("internet/update", async (e) => {
      const isOnline = e.detail;
      
      root.classList.remove(isOnline ? 'off' : 'on');
      root.classList.add(isOnline ? 'on' : 'off');

      iosFadeOut(background);
      iosFadeOut(svgWrapperElem);
      iosFadeOut(svgTextElem);

      await delay(100);
      iosFadeIn(background);

      await delay();
      
      svgWrapperElem.innerHTML = isOnline ? IOS_INTERNET.on : IOS_INTERNET.off;
      iosFadeIn(svgWrapperElem);

      await delay();
      svgTextElem.textContent = isOnline ? 'online' : 'offline';
      iosFadeIn(svgTextElem);
    });

    Internet.subscribe(this);
  }
}


class Store extends Component {
  render() {
    this.innerHTML = `
      <section id="widget-store">
        ${IOS_STORE}
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
          <app-online-widget></app-online-widget>
          <app-store-widget></app-store-widget>
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

customElements.define('app-online-widget', Online);

customElements.define('app-store-widget', Store);

customElements.define('app-widget', Widget);