export default class Component extends HTMLElement {
  constructor() {
    super();
    this.setup();
  }

  connectedCallback() { 
    this.render();
    this.afterMount();
  }

  disconnectedCallback() {}

  render() {}

  setup() {}

  afterMount() {}
}

/**
 * @typedef {import('../service/weather/weather.js').WeatherEventType} WeatherEventType;
 * @typedef {import("../service/geo/geo.js").GeoEventType} GeoEventType
 * @typedef {import("../service/internet/internet.js").InternetEventType} InternetEventType
 */
export class SubscribeComponent extends Component {
  /** 
   * @type {Array<{
   *  eventName: string;
   *  callback: (e: CustomEvent) => void;
   * }>}
   * */
  static _callback = [];

  /**
   * 
   * @param {GeoEventType | WeatherEventType | InternetEventType} eventName 
   * @param {(e: CustomEvent) => void} callback 
   */
  addSubscribeHandler(eventName, callback) {
    this.addEventListener(eventName, callback);
  }
}