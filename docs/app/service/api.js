// @ts-check

export class API {
  static firebase = "http://127.0.0.1:5001/fir-bb3d4/asia-northeast3"

  /**
   * @private
   * @param {'getCurrentGeo' | 'checkOrigin' | 'getCurrentWeather'} apiPath 
   * @param {{ [key: string]: string | number }} params 
   * @returns 
   */
  static _getQuery(apiPath, params = {}) {
    const param = Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');

    return `${this.firebase}/${apiPath}?${param}`;
  }

  static checkFirebase = async () => {
    const isDevMode = await fetch(this._getQuery("checkOrigin"))
      .then(() => true)
      .catch(() => false);

    if (!isDevMode) this.firebase = 'https://asia-northeast3-fir-bb3d4.cloudfunctions.net';
  }

  /**
   * @param {number} lat 
   * @param {number} lon 
   * @param {string} countryCode
   * @returns
   */
  static getWeather = async (lat, lon, countryCode) => {
    return await fetch(this._getQuery("getCurrentWeather", {
      lat, lon, units: 'metric', lang: countryCode.toLowerCase()
    }))
      .then(res => res.json())
      .then(d => d);
  }

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
      lat, lon
    }))
      .then(res => res.json())
      .then(d => d);
  }
}