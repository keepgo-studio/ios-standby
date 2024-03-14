(() => {
  // app/service/api.js
  var API = class {
    static firebase = "http://127.0.0.1:5001/fir-bb3d4/asia-northeast3";
    /**
     * @private
     * @param {'getCurrentGeo' | 'checkOrigin' | 'getCurrentWeather'} apiPath 
     * @param {{ [key: string]: string | number }} params 
     * @returns 
     */
    static _getQuery(apiPath, params = {}) {
      const param = Object.keys(params).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k])).join("&");
      return `${this.firebase}/${apiPath}?${param}`;
    }
    static checkFirebase = async () => {
      const isDevMode = await fetch(this._getQuery("checkOrigin")).then(() => true).catch(() => false);
      if (!isDevMode)
        this.firebase = "https://asia-northeast3-fir-bb3d4.cloudfunctions.net";
    };
    /**
     * @param {number} lat 
     * @param {number} lon 
     * @param {string} countryCode
     * @returns
     */
    static getWeather = async (lat, lon, countryCode) => {
      return await fetch(this._getQuery("getCurrentWeather", {
        lat,
        lon,
        units: "metric",
        lang: countryCode.toLowerCase()
      })).then((res) => res.json()).then((d) => d);
    };
    /**
     * @param {number} lat 
     * @param {number} lon
     * @returns {Promise<Array<{
     *  country: string;
     *  local_names: { [country_code: string]: string };
     *  name: string;
     * }>>}
     */
    static getGeo = async (lat, lon) => {
      return await fetch(this._getQuery("getCurrentGeo", {
        lat,
        lon
      })).then((res) => res.json()).then((d) => d);
    };
  };

  // vars.js
  var IOS_SVG = {
    location: `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_2_11649)">
      <path d="M2.16688 10.7576L9.28603 10.7869C9.35765 10.7869 9.4081 10.8015 9.43739 10.8308C9.46669 10.8601 9.48134 10.9106 9.48134 10.9822L9.50087 18.0427C9.50087 18.3357 9.56109 18.5799 9.68153 18.7752C9.80198 18.9705 9.95986 19.1153 10.1552 19.2097C10.3505 19.3041 10.5588 19.3399 10.7802 19.3172C11.0015 19.2944 11.2115 19.2097 11.41 19.0632C11.6086 18.9167 11.773 18.7035 11.9032 18.4236L19.12 2.90602C19.2828 2.54795 19.3447 2.22894 19.3056 1.94899C19.2665 1.66904 19.151 1.44281 18.9589 1.27028C18.7668 1.09775 18.5259 0.998471 18.2362 0.972429C17.9465 0.946387 17.6292 1.01475 17.2841 1.17751L1.67861 8.41383C1.4247 8.53102 1.23264 8.68402 1.10243 8.87282C0.972226 9.06162 0.897356 9.26507 0.877825 9.48317C0.858294 9.70127 0.895729 9.90635 0.99013 10.0984C1.08453 10.2905 1.22939 10.4467 1.4247 10.5672C1.62001 10.6876 1.86741 10.7511 2.16688 10.7576Z" fill="#fff"/>
      </g>
      <defs>
      <clipPath id="clip0_2_11649">
      <rect width="18.4441" height="18.3922" fill="white" transform="translate(0.872803 0.93161)"/>
      </clipPath>
      </defs>
    </svg>  
  `
  };
  var IOS_INTERNET = {
    on: `
    <svg viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_2_16788)">
      <path d="M0.874878 7.23542C0.874878 8.49844 1.0946 9.6996 1.53406 10.8389C1.97351 11.9782 2.60014 12.9874 3.41394 13.8663C3.60274 14.0746 3.81596 14.1804 4.05359 14.1837C4.29122 14.187 4.48816 14.0974 4.64441 13.9151C4.80066 13.7393 4.86088 13.544 4.82508 13.3292C4.78926 13.1143 4.68347 12.906 4.50769 12.7042C3.85013 11.975 3.34558 11.1433 2.99402 10.2091C2.64246 9.27481 2.46668 8.2836 2.46668 7.23542C2.46668 6.18724 2.64246 5.19603 2.99402 4.26179C3.34558 3.32755 3.85013 2.49584 4.50769 1.76667C4.68347 1.56485 4.78926 1.35651 4.82508 1.14167C4.86088 0.926828 4.80066 0.731515 4.64441 0.555734C4.48816 0.373443 4.29122 0.283925 4.05359 0.28718C3.81596 0.290435 3.60274 0.396229 3.41394 0.604562C2.87358 1.1905 2.41459 1.83666 2.03699 2.54304C1.65938 3.24942 1.3713 3.99649 1.17273 4.78425C0.974162 5.57201 0.874878 6.38907 0.874878 7.23542ZM4.98621 7.23542C4.98621 7.95157 5.10339 8.63679 5.33777 9.29108C5.57214 9.94538 5.90092 10.5362 6.3241 11.0636C6.49336 11.2849 6.70332 11.3972 6.95398 11.4005C7.20463 11.4037 7.41134 11.3142 7.5741 11.1319C7.73034 10.9561 7.78731 10.764 7.745 10.5557C7.70268 10.3474 7.60339 10.1358 7.44715 9.92096C7.15417 9.55638 6.93607 9.1446 6.79285 8.68561C6.64961 8.22663 6.578 7.74324 6.578 7.23542C6.578 6.72761 6.65287 6.24584 6.80261 5.79011C6.95235 5.33438 7.16719 4.92097 7.44715 4.54987C7.60339 4.33503 7.70268 4.12345 7.745 3.91511C7.78731 3.70678 7.73034 3.51472 7.5741 3.33893C7.41134 3.15665 7.20463 3.06713 6.95398 3.07038C6.70332 3.07364 6.49336 3.18594 6.3241 3.40729C5.90092 3.93464 5.57214 4.52546 5.33777 5.17975C5.10339 5.83405 4.98621 6.51928 4.98621 7.23542ZM9.48816 7.23542C9.48816 7.58698 9.58093 7.90437 9.76648 8.18757C9.95202 8.47077 10.1945 8.68073 10.494 8.81745V17.5968C10.494 17.8441 10.564 18.0459 10.704 18.2022C10.844 18.3585 11.0246 18.4366 11.246 18.4366C11.4738 18.4366 11.6545 18.3601 11.788 18.2071C11.9214 18.0541 11.9882 17.8507 11.9882 17.5968V8.81745C12.2811 8.68073 12.522 8.47077 12.7108 8.18757C12.8996 7.90437 12.994 7.58698 12.994 7.23542C12.994 6.9099 12.9159 6.61368 12.7597 6.34675C12.6034 6.07983 12.3934 5.86661 12.1298 5.7071C11.8661 5.5476 11.5715 5.46784 11.246 5.46784C10.9139 5.46784 10.6161 5.5476 10.3524 5.7071C10.0887 5.86661 9.87878 6.07983 9.72254 6.34675C9.56628 6.61368 9.48816 6.9099 9.48816 7.23542ZM14.9081 11.1319C15.0708 11.3142 15.2775 11.4037 15.5282 11.4005C15.7788 11.3972 15.9888 11.2849 16.1581 11.0636C16.5813 10.5362 16.91 9.94538 17.1444 9.29108C17.3788 8.63679 17.496 7.95157 17.496 7.23542C17.496 6.51928 17.3788 5.83405 17.1444 5.17975C16.91 4.52546 16.5813 3.93464 16.1581 3.40729C15.9888 3.18594 15.7788 3.07364 15.5282 3.07038C15.2775 3.06713 15.0708 3.15665 14.9081 3.33893C14.7518 3.51472 14.6948 3.70678 14.7372 3.91511C14.7795 4.12345 14.8788 4.33503 15.0351 4.54987C15.315 4.92097 15.5298 5.33438 15.6796 5.79011C15.8293 6.24584 15.9042 6.72761 15.9042 7.23542C15.9042 7.74324 15.8326 8.22663 15.6894 8.68561C15.5461 9.1446 15.328 9.55638 15.0351 9.92096C14.8788 10.1358 14.7795 10.3474 14.7372 10.5557C14.6948 10.764 14.7518 10.9561 14.9081 11.1319ZM17.8378 13.9151C17.994 14.0974 18.1926 14.187 18.4335 14.1837C18.6743 14.1804 18.8859 14.0746 19.0683 13.8663C19.8821 12.9874 20.5087 11.9782 20.9481 10.8389C21.3875 9.6996 21.6073 8.49844 21.6073 7.23542C21.6073 6.38907 21.508 5.57201 21.3095 4.78425C21.1109 3.99649 20.8228 3.24942 20.4452 2.54304C20.0676 1.83666 19.6086 1.1905 19.0683 0.604562C18.8859 0.396229 18.6743 0.290435 18.4335 0.28718C18.1926 0.283925 17.994 0.373443 17.8378 0.555734C17.6815 0.731515 17.6213 0.926828 17.6571 1.14167C17.6929 1.35651 17.7987 1.56485 17.9745 1.76667C18.632 2.49584 19.1366 3.32755 19.4882 4.26179C19.8397 5.19603 20.0155 6.18724 20.0155 7.23542C20.0155 8.2836 19.8397 9.27481 19.4882 10.2091C19.1366 11.1433 18.632 11.975 17.9745 12.7042C17.7987 12.906 17.6929 13.1143 17.6571 13.3292C17.6213 13.544 17.6815 13.7393 17.8378 13.9151Z" fill="#28CD41"/>
      </g>
      <defs>
      <clipPath id="clip0_2_16788">
      <rect width="20.7324" height="18.301" fill="white" transform="translate(0.874878 0.287094)"/>
      </clipPath>
      </defs>
    </svg>
  `,
    off: `
  <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_2_16792)">
    <path d="M4.09906 16.3175C4.25531 16.1417 4.31554 15.9464 4.27973 15.7315C4.24392 15.5167 4.13812 15.3084 3.96234 15.1065C3.30479 14.3774 2.80023 13.5457 2.44867 12.6114C2.09711 11.6772 1.92133 10.686 1.92133 9.63778C1.92133 8.7719 2.04177 7.94833 2.28265 7.16708C2.52354 6.38583 2.86859 5.66643 3.31781 5.00887L2.17523 3.8663C1.58278 4.67359 1.12705 5.56877 0.808045 6.55184C0.489034 7.53492 0.329529 8.56356 0.329529 9.63778C0.329529 10.9008 0.549255 12.102 0.988709 13.2413C1.42816 14.3806 2.05479 15.3897 2.86859 16.2686C3.0574 16.4769 3.27061 16.5827 3.50824 16.586C3.74587 16.5893 3.94281 16.4998 4.09906 16.3175ZM7.02875 13.5343C7.185 13.3585 7.24196 13.1664 7.19965 12.9581C7.15733 12.7498 7.05805 12.5382 6.9018 12.3233C6.60883 11.9588 6.39073 11.547 6.2475 11.088C6.10427 10.629 6.03265 10.1456 6.03265 9.63778C6.03265 9.35132 6.06032 9.07463 6.11566 8.8077C6.171 8.54078 6.25075 8.28362 6.35492 8.03622L5.13422 6.81551C4.90635 7.23869 4.73383 7.68954 4.61664 8.16805C4.49945 8.64657 4.44086 9.13648 4.44086 9.63778C4.44086 10.3539 4.55805 11.0392 4.79242 11.6935C5.02679 12.3478 5.35557 12.9386 5.77875 13.4659C5.94802 13.6872 6.15798 13.7995 6.40863 13.8028C6.65928 13.8061 6.86599 13.7166 7.02875 13.5343ZM10.7006 20.839C10.9285 20.839 11.1092 20.7625 11.2426 20.6095C11.3761 20.4565 11.4428 20.253 11.4428 19.9991V13.1339L9.94867 11.6397V19.9991C9.94867 20.2465 10.0187 20.4483 10.1586 20.6046C10.2986 20.7609 10.4793 20.839 10.7006 20.839ZM16.3549 12.255C16.5503 11.8579 16.6984 11.4396 16.7992 11.0001C16.9002 10.5606 16.9506 10.1065 16.9506 9.63778C16.9506 8.92164 16.8334 8.23642 16.599 7.58212C16.3647 6.92782 16.0359 6.337 15.6127 5.80965C15.4435 5.5883 15.2335 5.476 14.9828 5.47274C14.7322 5.46949 14.5255 5.55901 14.3627 5.7413C14.2065 5.91708 14.1495 6.10914 14.1918 6.31747C14.2342 6.52581 14.3335 6.73739 14.4897 6.95223C14.7697 7.32333 14.9845 7.73674 15.1342 8.19247C15.284 8.6482 15.3588 9.12997 15.3588 9.63778C15.3588 9.87867 15.3377 10.1163 15.2953 10.3507C15.253 10.585 15.1895 10.8064 15.1049 11.0147L16.3549 12.255ZM19.3432 15.253C19.8901 14.4457 20.3133 13.5668 20.6127 12.6163C20.9122 11.6658 21.0619 10.6729 21.0619 9.63778C21.0619 8.79143 20.9627 7.97437 20.7641 7.18661C20.5655 6.39885 20.2774 5.65178 19.8998 4.9454C19.5222 4.23902 19.0633 3.59286 18.5229 3.00692C18.3406 2.79859 18.129 2.6928 17.8881 2.68954C17.6473 2.68628 17.4487 2.7758 17.2924 2.95809C17.1362 3.13387 17.0759 3.32919 17.1117 3.54403C17.1475 3.75888 17.2533 3.96721 17.4291 4.16903C18.0867 4.8982 18.5912 5.72991 18.9428 6.66415C19.2944 7.59839 19.4701 8.5896 19.4701 9.63778C19.4701 10.4646 19.3595 11.2524 19.1381 12.0011C18.9168 12.7498 18.5978 13.4464 18.1811 14.0909L19.3432 15.253ZM19.2162 19.0909C19.366 19.2342 19.5466 19.3058 19.7582 19.3058C19.9698 19.3058 20.144 19.2342 20.2807 19.0909C20.4305 18.9412 20.5053 18.7621 20.5053 18.5538C20.5053 18.3455 20.4305 18.1697 20.2807 18.0265L2.77094 0.506924C2.6212 0.363695 2.44216 0.290453 2.23383 0.287198C2.0255 0.283943 1.84646 0.357185 1.69672 0.506924C1.55349 0.650153 1.48187 0.827562 1.48187 1.03915C1.48187 1.25074 1.55349 1.42815 1.69672 1.57137L19.2162 19.0909Z" fill="black" fill-opacity="0.85"/>
    </g>
    <defs>
    <clipPath id="clip0_2_16792">
    <rect width="20.7324" height="23.1057" fill="white" transform="translate(0.329529 0.287094)"/>
    </clipPath>
    </defs>
  </svg>  
  `
  };
  var IOS_STORE = `
  <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 120 120" id="apple-store">
    <a href="https://www.apple.com/kr/store" target="_blank">
      <defs><linearGradient id="a" x2="120" y1="60" y2="60" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fefefe"></stop><stop offset="1" stop-color="#fefefe"></stop></linearGradient><linearGradient id="b" x1="60" x2="60" y1="17.05" y2="98.62" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00e2f1"></stop><stop offset="1" stop-color="#0297d4"></stop></linearGradient></defs><path fill="url(#b)" d="M90 29H77.38a17.49 17.49 0 0 0-34.76 0H30a6 6 0 0 0-6 6v58a6 6 0 0 0 6 6h60a6 6 0 0 0 6-6V35a6 6 0 0 0-6-6ZM60 16.46A14.51 14.51 0 0 1 74.35 29h-28.7A14.51 14.51 0 0 1 60 16.46Z"></path><path fill="#f9f9f9" fill-rule="evenodd" d="M68.47 62A7.47 7.47 0 0 1 72 55.69a7.75 7.75 0 0 0-6-3.28c-2.57-.25-5 1.52-6.32 1.52s-3.32-1.47-5.44-1.43a8.08 8.08 0 0 0-6.84 4.13c-2.9 5-.74 12.53 2.1 16.63 1.39 2 3 4.26 5.21 4.17s2.88-1.34 5.4-1.34 3.24 1.34 5.45 1.3 3.68-2 5-4a17.85 17.85 0 0 0 2.29-4.7A7.26 7.26 0 0 1 68.47 62zm-4.15-12.29A7.29 7.29 0 0 0 66 44.44a7.38 7.38 0 0 0-4.86 2.5A6.89 6.89 0 0 0 59.42 52a6.13 6.13 0 0 0 4.9-2.29z"></path>
    </a>
  </svg>`;
  var IOS_DURATION = 700;
  var WEATHER_CODE = {
    "01d": "sun.max.fill.png",
    "02d": "cloud.sun.fill.png",
    "03d": "cloud.fill.png",
    "04d": "smoke.fill.png",
    "09d": "cloud.heavyrain.fill.png",
    "10d": "cloud.sun.rain.fill.png",
    "11d": "cloud.bolt.fill.png",
    "13d": "snowflake.fill.png",
    "50d": "cloud.fog.fill.png",
    "01n": "sun.max.png",
    "02n": "cloud.sun.png",
    "03n": "cloud.png",
    "04n": "smoke.png",
    "09n": "cloud.heavyrain.png",
    "10n": "cloud.sun.rain.png",
    "11n": "cloud.bolt.png",
    "13n": "snowflake.png",
    "50n": "cloud.fog.png"
  };

  // utils.js
  function isMobile() {
    return Boolean(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }
  function range(n, val = void 0) {
    return Array(n).fill(val);
  }
  function minMax(x, min, max) {
    if (x < min)
      return min;
    else if (x > max)
      return max;
    return x;
  }
  function delay(n = IOS_DURATION) {
    return new Promise((res) => setTimeout(() => res(true), n));
  }
  function isInIframe() {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  }

  // app/service/geo/geo.js
  var Geo = class {
    /**
     * @private
     * @type {Map<Element, Element>}
     */
    static _subscribers = /* @__PURE__ */ new Map();
    /** @private */
    static _updateSec = 30 * 60 * 1e3;
    // = 30 minutes;
    /**
     * @private
     * @type {GeoDataInfo}
     */
    static _data = {
      lat: null,
      lon: null,
      name: null,
      country: null,
      local_names: {}
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
      this._subscribers.forEach((elem) => this._sendEvent("geo/loading", elem, void 0));
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
        (res) => {
          this._data.lat = res.coords.latitude;
          this._data.lon = res.coords.longitude;
          this._notifyLoading();
          this._loadGeo();
          setInterval(() => this._loadGeo(), this._updateSec);
        },
        () => {
          if (!isInIframe()) {
            alert("without geolocation, the app cannot get weather information");
          }
        }
      );
    }
    static getData() {
      return this._data;
    }
  };

  // app/service/timer/timer.js
  var Timer = class {
    /**
     * @private
     * @type {Map<Element, Element>}
     */
    static _subscribers = /* @__PURE__ */ new Map();
    static time = /* @__PURE__ */ new Date();
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
      this.time = /* @__PURE__ */ new Date();
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
  };

  // app/service/weather/weather.js
  var Weather = class {
    /**
     * @private
     * @type {Map<Element, Element>}
     */
    static _subscribers = /* @__PURE__ */ new Map();
    /** @private */
    static _updateSec = 10 * 60 * 1e3;
    // = 10 minutes;
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
        temp_min: null
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
      this._subscribers.forEach((elem) => this._sendEvent("weather/loading", elem, void 0));
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
          call(1e3);
        }
      };
      const call = (n) => {
        return setTimeout(() => action(), n);
      };
      action();
    }
  };

  // app/service/internet/internet.js
  var Internet = class {
    /**
     * @private
     * @type {Map<Element, Element>}
     */
    static _subscribers = /* @__PURE__ */ new Map();
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
  };

  // app/core/animation.js
  var Ease = class {
    static easeOutExpo = (x) => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };
  };
  var MouseCoor = class {
    x1 = 0;
    y1 = 0;
    x2 = 0;
    y2 = 0;
    _isClicking = false;
    constructor() {
    }
    /**
     * 
     * @param {number} [x] 
     * @param {number} [y]
     */
    setIsClickingOn(x, y) {
      this._isClicking = true;
      if (x)
        this.x1 = x;
      if (y)
        this.y1 = y;
    }
    setIsClickingOff() {
      this._isClicking = false;
    }
    /**
     * 
     * @param {number} [x] 
     * @param {number} [y]
     * @param {() => void} [callback]
     */
    update(x, y, callback) {
      if (!this._isClicking)
        return;
      if (x)
        this.x2 = x;
      if (y)
        this.y2 = y;
      if (callback)
        callback();
    }
  };
  function addSwitchAnimation(root2, direction, initObj = { OPACITY_INIT: 0, SCALE_INIT: 0.7, listUi: false, infinite: false }) {
    root2.classList.add("ios-switch--container");
    [...root2.children].forEach((elem) => elem.classList.add("ios-switch--item"));
    let GIdx = 1, GLifeCycle = false, GLength, GScrollRef, GTotalLength;
    const GWindowResizeCallbackList = [];
    root2.style.overflow = "hidden";
    if (direction === "horizontal") {
      GLength = root2.offsetWidth;
      GScrollRef = "scrollLeft";
      root2.style.flexWrap = "nowrap";
    } else {
      GLength = root2.offsetHeight;
      GScrollRef = "scrollTop";
      root2.style.flexDirection = "column";
    }
    GWindowResizeCallbackList.push(() => {
      GLength = direction === "horizontal" ? root2.offsetWidth : root2.offsetHeight;
    });
    const SPRING_RATIO = 0.6;
    function getScrollPositionByIdx(_idx) {
      if (initObj.infinite) {
        return GLength * _idx;
      }
      if (_idx === 0)
        return 0;
      return (SPRING_RATIO + _idx - 1) * GLength;
    }
    if (!initObj.infinite) {
      const div1 = document.createElement("div"), div2 = document.createElement("div");
      div1.className = "ios-switch--dummy";
      div1.style.width = SPRING_RATIO * GLength + "px";
      div1.style.height = SPRING_RATIO * GLength + "px";
      div2.className = "ios-switch--dummy";
      div2.style.width = SPRING_RATIO * GLength + "px";
      div2.style.height = SPRING_RATIO * GLength + "px";
      root2.insertBefore(div1, root2.firstChild);
      root2.appendChild(div2);
      GWindowResizeCallbackList.push(() => {
        div1.style.width = SPRING_RATIO * GLength + "px";
        div1.style.height = SPRING_RATIO * GLength + "px";
        div2.style.width = SPRING_RATIO * GLength + "px";
        div2.style.height = SPRING_RATIO * GLength + "px";
      });
    } else {
      let animateScroll = function() {
        if (root2[GScrollRef] === 0) {
          root2[GScrollRef] = getScrollPositionByIdx(N - 2);
        } else if (root2[GScrollRef] === GTotalLength) {
          root2[GScrollRef] = getScrollPositionByIdx(1);
        }
        requestAnimationFrame(animateScroll);
      };
      const fc = (
        /** @type {Node} */
        root2.firstElementChild?.cloneNode(true)
      ), lc = (
        /** @type {Node} */
        root2.lastElementChild?.cloneNode(true)
      );
      root2.insertBefore(lc, root2.firstChild);
      root2.appendChild(fc);
      requestAnimationFrame(animateScroll);
    }
    const N = root2.children.length;
    const GCoor = new MouseCoor();
    const GScrollEndCallbackList = [];
    const GChildrenIdxMap = [...root2.children].reduce((prev, curr, i) => prev.set(curr, i), /* @__PURE__ */ new Map());
    GTotalLength = initObj.infinite ? GLength * (N - 1) : GLength * (N - 3 + SPRING_RATIO * 2);
    GWindowResizeCallbackList.push(() => {
      GTotalLength = initObj.infinite ? GLength * (N - 1) : GLength * (N - 3 + SPRING_RATIO * 2);
    });
    const ioForGIdxUpdate = new IntersectionObserver((entries) => entries.forEach((info) => {
      const i = GChildrenIdxMap.get(info.target);
      if (i !== GIdx && info.isIntersecting)
        GIdx = i;
    }));
    GChildrenIdxMap.forEach((i, elem) => {
      if (!initObj.infinite && (i === 0 || i === N - 1))
        return;
      ioForGIdxUpdate.observe(elem);
    });
    function moveTo(dest, duration) {
      const from = root2[GScrollRef], start = Date.now();
      function scroll() {
        if (!GLifeCycle)
          return;
        const currentTime = Date.now(), time = Math.min(1, (currentTime - start) / duration), easedT = Ease.easeOutExpo(time);
        root2[GScrollRef] = easedT * (dest - from) + from;
        if (time < 1)
          requestAnimationFrame(scroll);
        else
          GScrollEndCallbackList.forEach((_cb) => _cb());
      }
      requestAnimationFrame(scroll);
    }
    let GMoveStart = false;
    function getAngleType(dx, dy) {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      if (angle > -45 && angle <= 45) {
        return "horizontal";
      } else if (angle > 45 && angle <= 135) {
        return "vertical";
      } else if (angle > 135 || angle <= -135) {
        return "horizontal";
      }
      return "vertical";
    }
    if (!isMobile()) {
      root2.addEventListener("mousedown", (e) => {
        GLifeCycle = false;
        GCoor.setIsClickingOn(e.x, e.y);
      });
      root2.addEventListener("mousemove", (e) => {
        if (GMoveStart)
          e.stopPropagation();
        GCoor.update(e.x, e.y, () => {
          const from = root2[GScrollRef], cd = getAngleType(e.movementX, e.movementY), movement = e[`movement${direction === "horizontal" ? "X" : "Y"}`] * 0.7;
          if (cd === direction) {
            GMoveStart = true;
            root2[GScrollRef] = minMax(from + -movement, 0, GTotalLength);
          }
        });
      });
      const handler = (e) => {
        GMoveStart = false;
        GLifeCycle = true;
        GCoor.update(e.x, e.y, () => moveTo(getScrollPositionByIdx(GIdx), 1500));
        GCoor.setIsClickingOff();
      };
      root2.addEventListener("mouseup", handler);
      root2.addEventListener("mouseleave", handler);
    } else {
      root2.addEventListener("touchstart", (e) => {
        const x = e.touches[0].clientX, y = e.touches[0].clientY;
        GLifeCycle = false;
        GCoor.setIsClickingOn(x, y);
      });
      root2.addEventListener("touchmove", (e) => {
        if (GMoveStart)
          e.stopPropagation();
        const x = e.touches[0].clientX, y = e.touches[0].clientY;
        GCoor.update(x, y, () => {
          const from = root2[GScrollRef];
          const dx = GCoor.x2 - GCoor.x1, dy = GCoor.y2 - GCoor.y1, cd = getAngleType(dx, dy);
          let dis = (direction === "horizontal" ? dx : dy) * 0.7;
          if (direction === cd) {
            GMoveStart = true;
            root2[GScrollRef] = minMax(from + -dis, 0, GTotalLength);
          }
          GCoor.setIsClickingOn(x, y);
        });
      });
      root2.addEventListener("touchend", () => {
        GMoveStart = false;
        GLifeCycle = true;
        moveTo(getScrollPositionByIdx(GIdx), 1e3);
        GCoor.setIsClickingOff();
      });
    }
    const { OPACITY_INIT, SCALE_INIT } = initObj;
    const showingMap = /* @__PURE__ */ new Map();
    const coorList = range(N, 0);
    const ioForRenderTiming = new IntersectionObserver((entries) => entries.forEach((info) => {
      let isShowing = info.isIntersecting;
      showingMap.set(info.target, isShowing);
    }));
    GChildrenIdxMap.forEach((i, elem) => {
      coorList[i] = getScrollPositionByIdx(i);
      if (1 < i && i < N - 2) {
        ioForRenderTiming.observe(elem);
        showingMap.set(elem, false);
      } else {
        showingMap.set(elem, true);
      }
      elem.style.scale = String(SCALE_INIT);
      elem.style.opacity = String(OPACITY_INIT);
    });
    GWindowResizeCallbackList.push(() => {
      GChildrenIdxMap.forEach((i) => coorList[i] = getScrollPositionByIdx(i));
    });
    function getRatio(i) {
      return Math.abs(coorList[i] - root2[GScrollRef]);
    }
    function styleChildByIdx(elem, i) {
      let dis;
      if (i === 0) {
        dis = Math.min(getRatio(0), getRatio(N - 2));
      } else if (i === N - 1) {
        dis = Math.min(getRatio(1), getRatio(N - 1));
      } else {
        dis = getRatio(i);
      }
      const ratio = minMax(dis, 0, GLength) / GLength;
      const alpha = 1 - ratio * (1 - SCALE_INIT), beta = 1 - ratio * (1 - OPACITY_INIT);
      elem.style.scale = String(alpha);
      elem.style.opacity = String(beta);
    }
    function renderChildren() {
      GChildrenIdxMap.forEach((i, elem) => {
        const isShowing = showingMap.get(elem);
        if (!isShowing)
          return;
        styleChildByIdx(elem, i);
      });
      requestAnimationFrame(renderChildren);
    }
    requestAnimationFrame(renderChildren);
    if (initObj.listUi) {
      let setLengthListContainer = function() {
        if (direction === "horizontal") {
          listContainer.style.width = `${GTotalLength + GLength}px`;
        } else {
          listContainer.style.height = `${GTotalLength + GLength}px`;
        }
      }, renderList = function() {
        let currentIdx = GIdx;
        if (initObj.infinite) {
          if (currentIdx === N - 1)
            currentIdx = 1;
          else if (currentIdx === 0)
            currentIdx = N - 2;
        }
        listUlChildren.forEach((elem, _idx) => {
          if (currentIdx === _idx + 1)
            elem.classList.add("select");
          else
            elem.classList.remove("select");
        });
      }, animateList = function() {
        renderList();
        requestAnimationFrame(animateList);
      };
      const listContainer = document.createElement("div");
      const listUl = document.createElement("ul");
      listContainer.className = "ios-switch--list-container";
      setLengthListContainer();
      GWindowResizeCallbackList.push(() => setLengthListContainer());
      listUl.className = "ios-switch--list-ul";
      listUl.classList.add(direction === "horizontal" ? "hor" : "ver");
      listUl.innerHTML = range(N - 2).map(() => `<li></li>`).join("\n");
      listContainer.append(listUl);
      root2.append(listContainer);
      const listUlChildren = [...listUl.children];
      root2.addEventListener("mousedown", () => {
        iosFadeIn(listContainer);
      });
      requestAnimationFrame(animateList);
      GScrollEndCallbackList.push(() => iosFadeOut(listContainer));
      renderList();
    }
    function initScroll(i) {
      setTimeout(() => {
        GIdx = 1;
        root2[GScrollRef] = getScrollPositionByIdx(1);
      });
    }
    GWindowResizeCallbackList.push(() => initScroll(1));
    window.addEventListener("resize", () => GWindowResizeCallbackList.forEach((callback) => {
      callback();
    }));
    initScroll(1);
  }
  function getFadeClass(mode) {
    let appearClassName = "", disappearClassName = "";
    switch (mode) {
      case "fade":
        appearClassName = "ios-appear";
        disappearClassName = "ios-disappear";
        break;
      case "y-fade":
        appearClassName = "ios-y-appear";
        disappearClassName = "ios-y-disappear";
        break;
    }
    return [appearClassName, disappearClassName];
  }
  function iosFadeIn(elem, mode = "fade") {
    const [a, d] = getFadeClass(mode);
    elem.classList.remove(d);
    elem.classList.add(a);
  }
  function iosFadeOut(elem, mode = "fade") {
    const [a, d] = getFadeClass(mode);
    elem.classList.remove(a);
    elem.classList.add(d);
  }

  // app/core/component.js
  var Component = class extends HTMLElement {
    constructor() {
      super();
      this.setup();
    }
    connectedCallback() {
      this.render();
      this.afterMount();
    }
    disconnectedCallback() {
    }
    render() {
    }
    setup() {
    }
    afterMount() {
    }
  };
  var SubscribeComponent = class extends Component {
    /** 
     * @type {Array<{
     *  eventName: string;
     *  callback: (e: CustomEvent) => void;
     * }>}
     * */
    static _callback = [];
    /**
     * 
     * @param {GeoEventType | WeatherEventType | InternetEventType | TimerEventType} eventName 
     * @param {(e: CustomEvent) => void} callback 
     */
    addSubscribeHandler(eventName, callback) {
      this.addEventListener(eventName, callback);
    }
  };

  // app/service/timer/ui.js
  var TimerCoreComponent = class extends Component {
    /** @protected */
    _lifeCycle = true;
    /** @protected @type {HTMLElement} */
    _root;
    /** @protected @type {HTMLCanvasElement} */
    _canvas;
    /** @protected @type {CanvasRenderingContext2D} */
    _ctx;
    /** @private */
    _className = "ios-timer--canvas-container";
    /** @private */
    _ref() {
      this._root = /** @type {HTMLCanvasElement} */
      this.querySelector(`.${this._className}`);
      this._canvas = /** @type {HTMLCanvasElement} */
      this.querySelector(`.${this._className} canvas`);
      this._ctx = /** @type {any} */
      this._canvas.getContext("2d");
    }
    draw() {
    }
    resize() {
    }
    animation() {
      if (!this._lifeCycle)
        return;
      this.draw();
      requestAnimationFrame(this.animation.bind(this));
    }
    subscribeViewport() {
      const io = new IntersectionObserver((entries) => {
        this._lifeCycle = entries[0].isIntersecting;
        if (entries[0].isIntersecting) {
          requestAnimationFrame(this.animation.bind(this));
        }
      }, {
        threshold: 0.5
      });
      io.observe(this);
    }
    afterMount() {
      this._ref();
      window.addEventListener("resize", this.resize.bind(this));
      this.resize();
      this.subscribeViewport();
      requestAnimationFrame(this.animation.bind(this));
    }
    render() {
      this.innerHTML = `
      <section class="${this._className}">
        <canvas></canvas>
      </section>
    `;
    }
  };
  var TimerUiRectClock = class extends TimerCoreComponent {
    /** @private @type {number} */
    _cWidth;
    /** @private @type {number} */
    _cHeight;
    /** @private @type {number} */
    _radius;
    /** @private @type {number} */
    _heightMax;
    /** @private @type {number} */
    _widthMax;
    // https://codepen.io/sylaryip/pen/zYZxxyv?editors=1010
    draw() {
      this._ctx.clearRect(0, 0, this._cWidth, this._cHeight);
      const hr = Timer.time.getHours() * 60 * 60 * 1e3, min = Timer.time.getMinutes() * 60 * 1e3, sec = Timer.time.getSeconds() * 1e3, mSec = Timer.time.getMilliseconds();
      this._ctx.save();
      this.drawPanel();
      this.drawPointers();
      this.drawHourNums();
      this.drawHourIndicator(mSec + sec + min + hr);
      this.drawMinuteIndicator(mSec + sec + min);
      this.drawCentralPointer();
      this.drawSecondIndicator(mSec + sec);
      this._ctx.restore();
    }
    drawPanel() {
      this._ctx.beginPath();
      this._ctx.translate(this._cWidth / 2, this._cHeight / 2);
    }
    drawPointers() {
      this._ctx.lineCap = "round";
      const n = 60;
      range(n).forEach((_, idx) => {
        let rad = 2 * Math.PI / n * idx;
        const degree = 2 * idx * 180 / n;
        if (degree % 90 !== 0) {
          const triHD = this._heightMax / Math.cos(rad);
          const d = 90 < degree && degree < 270 ? -1 : 1;
          let addStart = 0;
          if (idx % 5 === 0) {
            this._ctx.strokeStyle = "#bbb";
            this._ctx.lineWidth = minMax(this._cHeight / 100, 2, 8);
            addStart = this._heightMax / 2.5;
          } else {
            this._ctx.strokeStyle = "#5c5c5c";
            this._ctx.lineWidth = minMax(this._cHeight / 200, 0.5, 4.5);
          }
          this._ctx.rotate(rad);
          this._ctx.beginPath();
          this._ctx.moveTo(0, d * triHD - addStart);
          this._ctx.lineTo(0, this._cWidth);
          this._ctx.stroke();
          this._ctx.rotate(-rad);
          const triWD = this._widthMax / Math.cos(rad);
          this._ctx.rotate(rad);
          this._ctx.moveTo(d * triWD, 0);
          this._ctx.lineTo(this._cWidth, 0);
          this._ctx.stroke();
          this._ctx.rotate(-rad);
        } else {
          const start = degree % 180 === 0 ? this._widthMax : this._heightMax;
          const addStrat = degree % 180 === 0 ? this._widthMax / 6 : 0;
          this._ctx.strokeStyle = "#bbb";
          this._ctx.lineWidth = minMax(this._cHeight / 100, 2, 8);
          this._ctx.rotate(rad);
          this._ctx.beginPath();
          this._ctx.moveTo(start - addStrat, 0);
          this._ctx.lineTo(this._cWidth, 0);
          this._ctx.stroke();
          this._ctx.rotate(-rad);
        }
      });
      this._ctx.save();
      this._ctx.restore();
    }
    drawHourNums() {
      const fontSize = this._cWidth / 18;
      this._ctx.font = `600 ${fontSize}px "SF Pro Display"`;
      this._ctx.textAlign = "center";
      this._ctx.textBaseline = "middle";
      this._ctx.fillStyle = "#fff";
      this._ctx.fontStretch = "expanded";
      const n = 4;
      range(n).forEach((_, idx) => {
        let rad = 2 * Math.PI / n * idx;
        let x = Math.cos(rad) * (this._cWidth / 2.7 - fontSize / 1.2);
        let y = Math.sin(rad) * (this._cHeight / 2.2 - fontSize / 1.2);
        this._ctx.beginPath();
        this._ctx.fillText(String((idx + 1) * 3), x, y);
      });
    }
    drawCentralPointer() {
      this._ctx.beginPath();
      this._ctx.fillStyle = "#fff";
      this._ctx.arc(0, 0, minMax(this._cHeight / 35, 6, 18), 0, 2 * Math.PI);
      this._ctx.fill();
      this._ctx.beginPath();
      this._ctx.fillStyle = "#F79A09";
      this._ctx.arc(0, 0, minMax(this._cHeight / 60, 2, 14), 0, 2 * Math.PI);
      this._ctx.fill();
    }
    /**
     * @param {number} miliSeconds
     */
    drawHourIndicator(miliSeconds) {
      const rad = 2 * Math.PI / (12 * 60 * 60 * 1e3) * miliSeconds;
      this._ctx.save();
      this._ctx.rotate(rad);
      this._ctx.lineCap = "round";
      this._ctx.strokeStyle = "#fff";
      this._ctx.shadowColor = "rgba(0,0,0,0.15)";
      this._ctx.shadowBlur = 10;
      this._ctx.beginPath();
      this._ctx.lineWidth = minMax(this._cHeight / 70, 2, 16);
      this._ctx.moveTo(0, 0);
      this._ctx.lineTo(0, -this._radius / 1.6);
      this._ctx.stroke();
      this._ctx.beginPath();
      this._ctx.lineWidth = minMax(this._cHeight / 38, 4, 20);
      this._ctx.moveTo(0, -this._radius / 5);
      this._ctx.lineTo(0, -this._radius / 1.6);
      this._ctx.stroke();
      this._ctx.restore();
    }
    /**
     * @param {number} miliSeconds
     */
    drawMinuteIndicator(miliSeconds) {
      const rad = 2 * Math.PI / (60 * 60 * 1e3) * miliSeconds;
      this._ctx.save();
      this._ctx.rotate(rad);
      this._ctx.lineCap = "round";
      this._ctx.strokeStyle = "#fff";
      this._ctx.beginPath();
      this._ctx.shadowColor = "rgba(0,0,0,0.5)";
      this._ctx.shadowBlur = 10;
      this._ctx.lineWidth = minMax(this._cHeight / 70, 2, 16);
      this._ctx.moveTo(0, 0);
      this._ctx.lineTo(0, -this._radius);
      this._ctx.stroke();
      this._ctx.beginPath();
      this._ctx.lineWidth = minMax(this._cHeight / 38, 4, 20);
      this._ctx.moveTo(0, -this._radius / 5);
      this._ctx.lineTo(0, -this._radius);
      this._ctx.stroke();
      this._ctx.restore();
    }
    /**
     * @param {number} miliSeconds
     */
    drawSecondIndicator(miliSeconds) {
      const rad = 2 * Math.PI / (60 * 1e3) * miliSeconds;
      this._ctx.save();
      this._ctx.beginPath();
      this._ctx.strokeStyle = "#F79A09";
      this._ctx.lineWidth = minMax(this._cHeight / 120, 2, 6);
      this._ctx.lineCap = "round";
      this._ctx.rotate(rad);
      this._ctx.moveTo(0, 0);
      this._ctx.lineTo(0, this._radius / 6);
      this._ctx.stroke();
      this._ctx.moveTo(0, 0);
      this._ctx.lineTo(0, -(this._cHeight / 2.1));
      this._ctx.stroke();
      this._ctx.restore();
      this._ctx.beginPath();
      this._ctx.fillStyle = "#000";
      this._ctx.arc(0, 0, minMax(this._cHeight / 120, 1, 8), 0, 2 * Math.PI);
      this._ctx.fill();
    }
    resize() {
      const retina = window.devicePixelRatio;
      if (retina > 1) {
        this._canvas.width = this._root.offsetWidth * retina;
        this._canvas.height = this._root.offsetHeight * retina;
        this._ctx.scale(retina, retina);
      } else {
        this._canvas.width = this._root.offsetWidth;
        this._canvas.height = this._root.offsetHeight;
      }
      this._canvas.style.width = this._root.offsetWidth + "px";
      this._canvas.style.height = this._root.offsetHeight + "px";
      this._cWidth = this._root.offsetWidth;
      this._cHeight = this._root.offsetHeight;
      this._radius = this._cHeight / 2 - 32;
      this._heightMax = this._cHeight / 2 * 0.85;
      this._widthMax = this._cWidth / 2 * 0.9;
    }
  };
  var TimerUiCircleClock = class extends TimerCoreComponent {
    /** @type {number} */
    _cWidth;
    /** @type {number} */
    _cHeight;
    /** @type {number} */
    _radius;
    // https://codepen.io/sylaryip/pen/zYZxxyv?editors=1010
    draw() {
      this._ctx.clearRect(0, 0, this._cWidth, this._cHeight);
      const hr = Timer.time.getHours() * 60 * 60 * 1e3, min = Timer.time.getMinutes() * 60 * 1e3, sec = Timer.time.getSeconds() * 1e3, mSec = Timer.time.getMilliseconds();
      this._ctx.save();
      this.drawPanel();
      this.drawHourNums();
      this.drawPointers();
      this.drawHourIndicator(mSec + sec + min + hr);
      this.drawMinuteIndicator(mSec + sec + min);
      this.drawCentralPointer();
      this.drawSecondIndicator(mSec + sec);
      this._ctx.restore();
    }
    drawPanel() {
      this._ctx.beginPath();
      this._ctx.translate(this._cWidth / 2, this._cWidth / 2);
    }
    drawPointers() {
      this._ctx.lineCap = "round";
      this._ctx.lineWidth = minMax(this._cHeight / 120, 1, 6);
      const n = 60;
      range(n).forEach((_, idx) => {
        let rad = 2 * Math.PI / n * idx;
        if (idx % 5 === 0)
          this._ctx.strokeStyle = "#fff";
        else
          this._ctx.strokeStyle = "#5c5c5c";
        this._ctx.rotate(rad);
        this._ctx.beginPath();
        this._ctx.moveTo(0, -this._radius / 0.94);
        this._ctx.lineTo(0, -this._radius);
        this._ctx.stroke();
        this._ctx.rotate(-rad);
      });
      this._ctx.save();
      this._ctx.restore();
    }
    drawHourNums() {
      const fontSize = this._cWidth / 12;
      this._ctx.font = `${fontSize}px "SF Pro Display"`;
      this._ctx.textAlign = "center";
      this._ctx.textBaseline = "middle";
      this._ctx.fillStyle = "#fff";
      range(12).forEach((_, idx) => {
        let rad = 2 * Math.PI / 12 * (idx - 2);
        let x = Math.cos(rad) * (this._radius - fontSize / 1.2);
        let y = Math.sin(rad) * (this._radius - fontSize / 1.2);
        this._ctx.beginPath();
        this._ctx.fillText(String(idx + 1), x + 3, y + 2);
      });
    }
    drawCentralPointer() {
      this._ctx.beginPath();
      this._ctx.fillStyle = "#fff";
      this._ctx.arc(0, 0, minMax(this._cHeight / 35, 6, 18), 0, 2 * Math.PI);
      this._ctx.fill();
      this._ctx.beginPath();
      this._ctx.fillStyle = "#F79A09";
      this._ctx.arc(0, 0, minMax(this._cHeight / 60, 2, 14), 0, 2 * Math.PI);
      this._ctx.fill();
    }
    /**
     * @param {number} miliSeconds
     */
    drawHourIndicator(miliSeconds) {
      const rad = 2 * Math.PI / (12 * 60 * 60 * 1e3) * miliSeconds;
      this._ctx.save();
      this._ctx.rotate(rad);
      this._ctx.lineCap = "round";
      this._ctx.strokeStyle = "#fff";
      this._ctx.shadowColor = "rgba(0,0,0,0.15)";
      this._ctx.shadowBlur = 10;
      this._ctx.beginPath();
      this._ctx.lineWidth = minMax(this._cHeight / 70, 2, 16);
      this._ctx.moveTo(0, 0);
      this._ctx.lineTo(0, -this._radius / 1.6);
      this._ctx.stroke();
      this._ctx.beginPath();
      this._ctx.lineWidth = minMax(this._cHeight / 38, 4, 20);
      this._ctx.moveTo(0, -this._radius / 6);
      this._ctx.lineTo(0, -this._radius / 1.6);
      this._ctx.stroke();
      this._ctx.restore();
    }
    /**
     * @param {number} miliSeconds
     */
    drawMinuteIndicator(miliSeconds) {
      const rad = 2 * Math.PI / (60 * 60 * 1e3) * miliSeconds;
      this._ctx.save();
      this._ctx.rotate(rad);
      this._ctx.lineCap = "round";
      this._ctx.strokeStyle = "#fff";
      this._ctx.beginPath();
      this._ctx.shadowColor = "rgba(0,0,0,0.5)";
      this._ctx.shadowBlur = 10;
      this._ctx.lineWidth = minMax(this._cHeight / 70, 2, 16);
      this._ctx.moveTo(0, 0);
      this._ctx.lineTo(0, -this._radius / 1.01);
      this._ctx.stroke();
      this._ctx.beginPath();
      this._ctx.lineWidth = minMax(this._cHeight / 38, 4, 20);
      this._ctx.moveTo(0, -this._radius / 6);
      this._ctx.lineTo(0, -this._radius / 0.98);
      this._ctx.stroke();
      this._ctx.restore();
    }
    /**
     * @param {number} miliSeconds
     */
    drawSecondIndicator(miliSeconds) {
      const rad = 2 * Math.PI / (60 * 1e3) * miliSeconds;
      this._ctx.save();
      this._ctx.beginPath();
      this._ctx.strokeStyle = "#F79A09";
      this._ctx.lineWidth = minMax(this._cWidth / 120, 2, 6);
      this._ctx.lineCap = "round";
      this._ctx.rotate(rad);
      this._ctx.moveTo(0, 0);
      this._ctx.lineTo(0, this._radius / 6);
      this._ctx.stroke();
      this._ctx.moveTo(0, 0);
      this._ctx.lineTo(0, -this._radius * 1.07);
      this._ctx.stroke();
      this._ctx.restore();
      this._ctx.beginPath();
      this._ctx.fillStyle = "#000";
      this._ctx.arc(0, 0, minMax(this._cHeight / 120, 1, 8), 0, 2 * Math.PI);
      this._ctx.fill();
    }
    resize() {
      let w = Math.min(this._root.offsetWidth, this._root.offsetHeight);
      const retina = window.devicePixelRatio;
      if (retina > 1) {
        this._canvas.width = w * retina;
        this._canvas.height = w * retina;
        this._ctx.scale(retina, retina);
      } else {
        this._canvas.width = w;
        this._canvas.height = w;
      }
      this._canvas.style.width = w + "px";
      this._canvas.style.height = w + "px";
      this._cWidth = w;
      this._cHeight = w;
      this._radius = this._cWidth / 2 - 32;
    }
  };
  var TimerUiText1 = class extends SubscribeComponent {
    render() {
      this.innerHTML = `
      <div class="ios-timer--text1">
        <div class="ios-timer--text-container">
          <p class="hour">
            <span></span>
            <span></span>
          </p>
          
          <div></div>

          <p class="minute">
            <span></span>
            <span></span>
          </p>
        </div>

        <div class="ios-timer--date-container">
          <div class="date-temp">
            <p class="date"></p>
            <p class="temp"></p>
          </div>

          <div></div>
        </div>
      </div>
    `;
    }
    afterMount() {
      const timeElems = [
        /** @type {HTMLElement} */
        this.querySelector(".ios-timer--text1 .hour span:nth-child(1)"),
        /** @type {HTMLElement} */
        this.querySelector(".ios-timer--text1 .hour span:nth-child(2)"),
        /** @type {HTMLElement} */
        this.querySelector(".ios-timer--text1 .minute span:nth-child(1)"),
        /** @type {HTMLElement} */
        this.querySelector(".ios-timer--text1 .minute span:nth-child(2)")
      ];
      const dateElem = (
        /** @type {HTMLElement} */
        this.querySelector(".ios-timer--text1 .ios-timer--date-container .date-temp .date")
      );
      const tempElem = (
        /** @type {HTMLElement} */
        this.querySelector(".ios-timer--text1 .ios-timer--date-container .date-temp .temp")
      );
      const parseTime = (num) => ("0" + num).slice(-2).split("");
      const draw = (date) => {
        const textList = [
          ...parseTime(date.getHours()),
          ...parseTime(date.getMinutes())
        ];
        Promise.all(range(4).map(async (_, i) => {
          const elem = timeElems[i];
          if (elem.textContent === textList[i])
            return;
          iosFadeOut(elem, "y-fade");
          await delay();
          elem.textContent = String(textList[i]);
          iosFadeIn(elem, "y-fade");
        }));
        const day = date.toLocaleDateString(navigator.language, { weekday: "long" });
        dateElem.innerHTML = `
        <p>${date.getDate()}\uC77C (<span>${day}</span>)</p>
      `;
      };
      this.addSubscribeHandler("timer/update", async (e) => {
        draw(e.detail);
      });
      Timer.subscribe(this);
      draw(Timer.time);
      const renderTemp = async (t) => {
        iosFadeOut(tempElem);
        await delay();
        tempElem.textContent = `${t ? Math.round(t) : "--"}\xB0C`;
        iosFadeIn(tempElem);
      };
      this.addSubscribeHandler("weather/update", (e) => {
        renderTemp(e.detail.main.temp);
      });
      Weather.subscribe(this);
      renderTemp(null);
    }
  };
  customElements.define("app-timer-rect", TimerUiRectClock);
  customElements.define("app-timer-circle", TimerUiCircleClock);
  customElements.define("app-timer-text1", TimerUiText1);

  // app/components/widget.js
  var Home = class extends SubscribeComponent {
    render() {
      this.innerHTML = `
      <section class="widget-home">
        <div class="container">
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
        </div>
      </section>
    `;
    }
    afterMount() {
      const tempElem = (
        /** @type {Element} */
        this.querySelector(".container > .temp")
      );
      const headerElem = (
        /** @type {Element} */
        this.querySelector(".container header")
      );
      const weatherImgElem = (
        /** @type {HTMLImageElement} */
        this.querySelector(".container img")
      );
      const weatherDescElem = (
        /** @type {Element} */
        this.querySelector(".container .desc")
      );
      const weatherMinMaxElem = (
        /** @type {Element} */
        this.querySelector(".container .min-max")
      );
      this.addSubscribeHandler("weather/update", (e) => {
        const { temp, temp_max, temp_min } = e.detail.main;
        const renderTemp = async () => {
          if (temp === null)
            return;
          iosFadeOut(tempElem);
          await delay();
          tempElem.innerHTML = `
          <span>${Math.round(temp)}\xB0</span>
        `;
          iosFadeIn(tempElem);
        };
        const renderWeatherImg = async () => {
          try {
            const { icon } = e.detail.weather[0];
            iosFadeOut(weatherImgElem);
            await delay();
            weatherImgElem.src = `./static/weather/${WEATHER_CODE[icon]}`;
            iosFadeIn(weatherImgElem);
          } catch {
          }
          ;
        };
        const renderWeatherDesc = async () => {
          try {
            const { description } = e.detail.weather[0];
            iosFadeOut(weatherDescElem);
            await delay();
            weatherDescElem.innerHTML = `
            <span>${description}</span>
          `;
            iosFadeIn(weatherDescElem);
          } catch {
          }
          ;
        };
        const renderWeatherMinMax = async () => {
          if (temp_min === null || temp_max === null)
            return;
          iosFadeOut(weatherMinMaxElem);
          await delay();
          weatherMinMaxElem.innerHTML = `
          <span>max: ${Math.round(temp_max)}\xB0</span>  
          <span>min: ${Math.round(temp_min)}\xB0</span>
        `;
          iosFadeIn(weatherMinMaxElem);
        };
        Promise.all([
          renderWeatherImg(),
          renderTemp(),
          renderWeatherDesc(),
          renderWeatherMinMax()
        ]);
      });
      Weather.subscribe(this);
      this.addSubscribeHandler("geo/update", async (e) => {
        const { name, local_names } = e.detail;
        if (name === null || local_names === null)
          return;
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
  };
  var Online = class extends SubscribeComponent {
    render() {
      this.innerHTML = `
      <section class="widget-internet">
        <div class="container">
          <div class="svg-wrapper"></div>

          <div class="text"></div>

          <div class="background"></div>
        </div>
      </section>
    `;
    }
    afterMount() {
      const root2 = (
        /** @type {Element} */
        this.querySelector(".container")
      );
      const background = (
        /** @type {Element} */
        this.querySelector(".container .background")
      );
      const svgWrapperElem = (
        /** @type {Element} */
        this.querySelector(".container .svg-wrapper")
      );
      const svgTextElem = (
        /** @type {Element} */
        this.querySelector(".container .text")
      );
      this.addSubscribeHandler("internet/update", async (e) => {
        const isOnline = e.detail;
        iosFadeOut(background);
        iosFadeOut(svgWrapperElem);
        iosFadeOut(svgTextElem);
        await delay();
        root2.classList.remove(isOnline ? "off" : "on");
        root2.classList.add(isOnline ? "on" : "off");
        await delay(100);
        iosFadeIn(background);
        await delay();
        svgWrapperElem.innerHTML = isOnline ? IOS_INTERNET.on : IOS_INTERNET.off;
        iosFadeIn(svgWrapperElem);
        await delay();
        svgTextElem.textContent = isOnline ? "online" : "offline";
        iosFadeIn(svgTextElem);
      });
      Internet.subscribe(this);
    }
  };
  var Store = class extends Component {
    render() {
      this.innerHTML = `
      <section class="widget-store">
        <div class="container">
        ${IOS_STORE}
        </div>
      </section>
    `;
    }
  };
  var Widget = class extends Component {
    render() {
      this.innerHTML = `
      <section id="widget">
        <div class="container">
          <app-home-widget></app-home-widget>
          <app-online-widget></app-online-widget>
          <app-store-widget></app-store-widget>
        </div>
      </section>
    `;
    }
    afterMount() {
      const container = (
        /** @type {HTMLElement} */
        this.querySelector("#widget > .container")
      );
      addSwitchAnimation(container, "vertical", {
        SCALE_INIT: 0.8,
        OPACITY_INIT: 0,
        listUi: true,
        infinite: true
      });
    }
  };
  customElements.define("app-home-widget", Home);
  customElements.define("app-online-widget", Online);
  customElements.define("app-store-widget", Store);
  customElements.define("app-widget", Widget);

  // app/app.js
  var Screen3 = class extends Component {
    render() {
      this.innerHTML = `
      <section id="screen3">
        <app-timer-rect></app-timer-rect>
        <app-timer-text1></app-timer-text1>
      </section>
    `;
    }
    afterMount() {
      const screen3 = (
        /** @type {HTMLElement} */
        this.querySelector("#screen3")
      );
      addSwitchAnimation(screen3, "vertical", {
        listUi: true,
        SCALE_INIT: 0.8,
        OPACITY_INIT: 0,
        infinite: false
      });
    }
  };
  var Screen2 = class extends Component {
    render() {
      this.innerHTML = `
      <section id="screen2">
      IOS STANDBY
      </section>
    `;
    }
  };
  var Screen1 = class extends Component {
    render() {
      this.innerHTML = `
      <section id="screen1">
        <app-timer-circle></app-timer-circle>
        <app-widget></app-widget>
      </section>
    `;
    }
  };
  var App = class extends Component {
    render() {
      this.innerHTML = `
      <div id="app">
        <app-screen1></app-screen1>
        <app-screen2></app-screen2>
        <app-screen3></app-screen3>
      </div>
    `;
    }
    afterMount() {
      const app = (
        /** @type {HTMLElement} */
        this.querySelector("#app")
      );
      addSwitchAnimation(app, "horizontal");
    }
  };
  customElements.define("app-screen3", Screen3);
  customElements.define("app-screen2", Screen2);
  customElements.define("app-screen1", Screen1);
  customElements.define("app-root", App);

  // index.js
  var root = document.getElementById("root");
  window.onload = () => {
    Internet.on();
    Timer.on();
    Geo.on();
    Weather.on();
    API.checkFirebase();
    if (root)
      root.innerHTML = "<app-root></app-root>";
  };
})();
