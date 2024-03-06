// @ts-check

import { API } from "../api.js";
import { Geo } from "../geo/geo.js";

/**
 * @typedef {"weather/update" | "weather/loading"} WeatherEventType
 * 
 * @typedef {{
 *    weather: Array<{
 *      icon: string | null;
 *      description;
 *    }>;
 *    main : {
 *      feels_like: number | null;
 *      humidit: number | null;
 *      pressur: number | null;
 *      temp: number | null;
 *      temp_max: number | null;
 *      temp_min: number | null;
 *   }
 * }} WeatherDataInfo
 */

export class Weather {
  /**
   * @private
   * @type {Map<Element, Element>}
   */
  static _subscribers = new Map();

  /** @private */
  static _updateSec = 10 * 60 * 1000; // = 10 minutes;

  /**
   * @private
   * @type {WeatherDataInfo}
   */
  static _data = {
    main: {
      feels_like: null,
      humidit: null,
      pressur: null,
      temp: null,
      temp_max: null,
      temp_min: null,
    },
    weather: []
  };

  /**
   * @param {WeatherEventType} eventName 
   * @param {Element} elem 
   * @param {any} data
   */
  static _sendEvent(eventName, elem, data) {
    elem.dispatchEvent(new CustomEvent(eventName, {
      detail: data,
      bubbles: false,
      composed: false
    }));
  }

  /** @private */
  static _notifyData() {
    this._subscribers.forEach((elem) => this._sendEvent("weather/update", elem, this._data));
  }

  /** @private */
  static _notifyLoading() {
    this._subscribers.forEach((elem) => this._sendEvent("weather/loading", elem, undefined));
  }

  /** @private */
  static async _loadWeather() {
    const { lat, lon, country } = Geo.getData();

    if (lat === null || lon === null || country === null) {
      throw new Error("[Weather Error] cannot load Geo data for some reason");
    }

    const data = await API.getWeather(lat, lon, country);

    
    for (const key in this._data) {
      this._data[key] = data[key];
    }

    this._notifyData();
  }

  /** @param {Element} elem */
  static subscribe(elem) {
    this._subscribers.set(elem, elem);

    this._sendEvent("weather/update", elem, this._data);
  }

  /** @param {Element} elem */
  static unsubscribe(elem) {
    this._subscribers.delete(elem);
  }

  static on() {
    const action = async () => {
      this._notifyLoading();

      try {
        await this._loadWeather();
        call(this._updateSec);
      } catch {
        call(1000);
      }
    }

    const call = (n) => {
      return setTimeout(() => action(), n);
    }

    action();
  }
}