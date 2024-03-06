// @ts-check

/**
 * @typedef {"internet/update"} InternetEventType
 * 
 */

export class Internet {
  /**
   * @private
   * @type {Map<Element, Element>}
   */
  static _subscribers = new Map();

  /** @private */
  static _online = false;

  /**
   * 
   * @param {InternetEventType} eventName 
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
    this._subscribers.forEach((elem) => this._sendEvent("internet/update", elem, this._online));
  }

  /**
   * @param {boolean} isOnline 
   */
  static _loadOnline(isOnline) {
    this._online = isOnline;
    this._notifyData();
  }

  /** @param {Element} elem */
  static subscribe(elem) {
    this._subscribers.set(elem, elem);

    this._sendEvent("internet/update", elem, this._online);
  }

  /** @param {Element} elem */
  static unsubscribe(elem) {
    this._subscribers.delete(elem);
  }

  static on() {
    window.addEventListener("online", () => this._loadOnline(true));

    window.addEventListener("offline", () => this._loadOnline(false));

    this._loadOnline(navigator.onLine);
  }
}