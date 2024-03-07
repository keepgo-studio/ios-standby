// @ts-check

/**
 * @typedef {"timer/update"} TimerEventType
 * 
 */

export class Timer {
  /**
   * @private
   * @type {Map<Element, Element>}
   */
  static _subscribers = new Map();

  static time = new Date();

  /**
   * 
   * @param {TimerEventType} eventName 
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
    this._subscribers.forEach((elem) => this._sendEvent("timer/update", elem, this.time));
  }

  static _tikTok() {
    const oldDate = this.time;
    this.time = new Date();

    if (this.time.getMinutes() !== oldDate.getMinutes()) {
      this._notifyData();
    }

    requestAnimationFrame(this._tikTok.bind(this));
  }

  static on() {
    requestAnimationFrame(this._tikTok.bind(this));
  }

  /** @param {Element} elem */
  static subscribe(elem) {
    this._subscribers.set(elem, elem);

    this._sendEvent("timer/update", elem, this.time);
  }

  /** @param {Element} elem */
  static unsubscribe(elem) {
    this._subscribers.delete(elem);
  }
}