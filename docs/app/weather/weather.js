// @ts-check

export class Weather {
  /**
   * @type {Map<Element, Element>}
   */
  static _subscribers = new Map();
  static _updateSec = 5 * 60 * 1000; // = 5 minutes;

  static _update() {
    this._subscribers.forEach((elem) => elem.dispatchEvent(new CustomEvent("weather-update", {
      detail: {}
    })));
  }

  static on() {
    setInterval(async () => {
      
    }, this._updateSec);
  }

  /**
   * @param {Element} elem 
   */
  static subscribe(elem) {
    this._subscribers.set(elem, elem);
  }

  static unsubscribe(elem) {
    this._subscribers.delete(elem);
  }
}