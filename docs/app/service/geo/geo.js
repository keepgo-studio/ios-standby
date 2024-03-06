// @ts-check

import { API } from "../api.js";

/**
 * @typedef {"geo/update" | "geo/loading"} GeoEventType
 * 
 * @typedef {{
 *    lat: number | null;
 *    lon: number | null;
 *    name: string | null;
 *    local_names: { [name: string] : string };
 *    country: string | null;
 * }} GeoDataInfo
 */


export class Geo {
  /**
   * @private
   * @type {Map<Element, Element>}
   */
  static _subscribers = new Map();

  /** @private */
  static _updateSec = 30 * 60 * 1000; // = 30 minutes;

  /**
   * @private
   * @type {GeoDataInfo}
   */
  static _data = {
    lat: null,
    lon: null,
    name: null,
    country: null,
    local_names: {},
  };

  /**
   * 
   * @param {GeoEventType} eventName 
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
    this._subscribers.forEach((elem) => this._sendEvent("geo/update", elem, this._data));
  }

  /** @private */
  static _notifyLoading() {
    this._subscribers.forEach((elem) => this._sendEvent("geo/loading", elem, undefined));
  }

  /** @private */
  static async _loadGeo() {
    const { lat, lon } = this._data;

    if (lat === null || lon === null) {
      throw new Error("[Geo Error] latitude and longitude cannot load for some reason");
    }

    const data = await API.getGeo(lat, lon);

    for (const key in this._data) {
      this._data[key] = data[0][key];
    }

    this._notifyData();
  }

  /** @param {Element} elem */
  static subscribe(elem) {
    this._subscribers.set(elem, elem);

    this._sendEvent("geo/update", elem, this._data);
  }

  /** @param {Element} elem */
  static unsubscribe(elem) {
    this._subscribers.delete(elem);
  }

  static on() {
    navigator.geolocation.getCurrentPosition(
      res => {
        this._data.lat = res.coords.latitude;
        this._data.lon = res.coords.longitude;

        // Only loading at first
        this._notifyLoading();

        this._loadGeo();

        setInterval(() => this._loadGeo(), this._updateSec);
      }
    );
  }

  static getData() {
    return this._data;
  }
}