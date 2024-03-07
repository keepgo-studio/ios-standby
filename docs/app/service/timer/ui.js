// @ts-check

import { delay, minMax, range } from "../../../utils.js";
import { iosFadeIn, iosFadeOut } from "../../core/animation.js";
import Component, { SubscribeComponent } from "../../core/component.js";
import { Weather } from "../weather/weather.js";
import { Timer } from "./timer.js";


class TimerCoreComponent extends Component {
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
    this._root = /** @type {HTMLCanvasElement} */ (this.querySelector(`.${this._className}`));
    this._canvas = /** @type {HTMLCanvasElement} */ (this.querySelector(`.${this._className} canvas`));
    this._ctx = /** @type {any} */ (this._canvas.getContext('2d'));
  }

  draw() {}

  setStates() {}

  animation() {
    if (this._lifeCycle) this.draw();

    requestAnimationFrame(this.animation.bind(this));
  }

  subscribeViewport() {
    const io = new IntersectionObserver((entries) => {
      this._lifeCycle = entries[0].isIntersecting;
    }, {
      threshold: 0.5
    })

    io.observe(this);
  }

  afterMount() {
    this._ref();

    this.setStates();
    
    this.subscribeViewport();
    
    this.draw();
    requestAnimationFrame(this.animation.bind(this));
  }

  render() {
    this.innerHTML = `
      <section class="${this._className}">
        <canvas></canvas>
      </section>
    `;
  }
}

class TimerUiRectClock extends TimerCoreComponent {
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

    const hr = Timer.time.getHours() * 60 * 60 * 1000,
          min = Timer.time.getMinutes() * 60 * 1000,
          sec = Timer.time.getSeconds() * 1000,
          mSec = Timer.time.getMilliseconds();
    
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
      let rad = ((2 * Math.PI) / n) * idx;

      const degree = 2 * idx * 180 / n;

      // 0 <= degree && degree < 90 || 
      // 90 < degree && degree < 180 || // minus
      // 180 < degree && degree < 270 || // minus
      // 270 < degree && degree < 360
      if (
        degree % 90 !== 0
      ) {
        const triHD = this._heightMax / Math.cos(rad);
        const d =  (90 < degree && degree < 270) ? -1 : 1;
        let addStart = 0;

        if (idx % 5 === 0) {
          this._ctx.strokeStyle = '#bbb';
          this._ctx.lineWidth = minMax(this._cHeight / 100, 4, 8);
          addStart = this._heightMax / 2.5;
        } else {
          this._ctx.strokeStyle = '#5c5c5c';
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
        this._ctx.moveTo(d * triWD , 0);
        this._ctx.lineTo(this._cWidth , 0);
        this._ctx.stroke();
        this._ctx.rotate(-rad);
      } else {
        const start = degree % 180 === 0 ? this._widthMax : this._heightMax;
        const addStrat = degree % 180 === 0 ? this._widthMax / 6 : 0;
        this._ctx.strokeStyle = '#bbb';
        this._ctx.lineWidth = minMax(this._cHeight / 100, 4, 8);

        this._ctx.rotate(rad);
        this._ctx.beginPath();
        this._ctx.moveTo(start - addStrat, 0);
        this._ctx.lineTo(this._cWidth , 0);
        this._ctx.stroke();
        this._ctx.rotate(-rad);
      }
    });

    this._ctx.save();
    this._ctx.restore();
  }

  drawHourNums() {
    const fontSize = this._cWidth / 16;
    this._ctx.font = `600 ${fontSize}px "sans-serif"`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";
    this._ctx.fillStyle = "#fff";
    // @ts-ignore
    this._ctx.fontStretch = "expanded";

    const n = 4;
    range(n).forEach((_, idx) => {
      let rad = ((2 * Math.PI) / n) * idx;
      let x = Math.cos(rad) * (this._cWidth / 2.7 - fontSize / 1.2);
      let y = Math.sin(rad) * (this._cHeight / 2.2 - fontSize / 1.2);
      this._ctx.beginPath();

      this._ctx.fillText(String((idx + 1) * 3), x, y);
    });
  }

  drawCentralPointer() {
    this._ctx.beginPath();
    this._ctx.fillStyle = "#fff";
    this._ctx.arc(0, 0, minMax(this._cHeight / 35, 10, 18), 0, 2 * Math.PI);
    this._ctx.fill();

    this._ctx.beginPath();
    this._ctx.fillStyle = "#F79A09";
    this._ctx.arc(0, 0, minMax(this._cHeight / 50, 6, 14), 0, 2 * Math.PI);
    this._ctx.fill();
  }

  /**
   * @param {number} miliSeconds
   */
  drawHourIndicator(miliSeconds) {
    const rad = ((2 * Math.PI) / (12 * 60 * 60 * 1000)) * miliSeconds;
    
    this._ctx.save();
    this._ctx.rotate(rad);
    this._ctx.lineCap = "round";
    this._ctx.strokeStyle = '#fff';
    this._ctx.shadowColor = 'rgba(0,0,0,0.15)';
    this._ctx.shadowBlur = 10;

    this._ctx.beginPath();
    this._ctx.lineWidth = minMax(this._cHeight / 64, 8, 16);
    this._ctx.moveTo(0, 0);
    this._ctx.lineTo(0, - this._radius / 1.6);
    this._ctx.stroke();
    
    this._ctx.beginPath();
    this._ctx.lineWidth = minMax(this._cHeight / 32, 12, 20);
    this._ctx.moveTo(0, - this._radius / 6);
    this._ctx.lineTo(0, - this._radius / 1.6);
    this._ctx.stroke();

    this._ctx.restore();
  }

  /**
   * @param {number} miliSeconds
   */
  drawMinuteIndicator(miliSeconds) {
    const rad = ((2 * Math.PI) / (60 * 60 * 1000)) * miliSeconds;

    this._ctx.save();

    this._ctx.rotate(rad);
    this._ctx.lineCap = "round";
    this._ctx.strokeStyle = '#fff';

    this._ctx.beginPath();
    this._ctx.shadowColor = 'rgba(0,0,0,0.5)';
    this._ctx.shadowBlur = 10;
    this._ctx.lineWidth = minMax(this._cHeight / 64, 8, 16);
    this._ctx.moveTo(0, 0);
    this._ctx.lineTo(0, - this._radius);
    this._ctx.stroke();

    this._ctx.beginPath();
    this._ctx.lineWidth = minMax(this._cHeight / 32, 12, 20);
    this._ctx.moveTo(0, - this._radius / 6);
    this._ctx.lineTo(0, - this._radius);
    this._ctx.stroke();

    this._ctx.restore();
  }

  /**
   * @param {number} miliSeconds
   */
  drawSecondIndicator(miliSeconds) {
    const rad = ((2 * Math.PI) / (60 * 1000)) * miliSeconds;
    
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
    this._ctx.lineTo(0, - this._radius / 0.94);
    this._ctx.stroke();
    this._ctx.restore();

    this._ctx.beginPath();
    this._ctx.fillStyle = "#000";
    this._ctx.arc(0, 0, minMax(this._cHeight / 90, 4, 8), 0, 2 * Math.PI);
    this._ctx.fill();
  }

  setStates() {
    this._canvas.width = this._root.offsetWidth;
    this._canvas.height = this._root.offsetHeight;
    this._cWidth = this._root.offsetWidth;
    this._cHeight = this._root.offsetHeight;

    this._radius = this._cHeight / 2 - 32;
    
    this._heightMax = this._cHeight / 2 * 0.85;
    this._widthMax = this._cWidth / 2 * 0.9;
  }
}

class TimerUiCircleClock extends TimerCoreComponent {
  /** @type {number} */
  _cWidth;
  /** @type {number} */
  _cHeight;
  /** @type {number} */
  _radius;

  // https://codepen.io/sylaryip/pen/zYZxxyv?editors=1010
  draw() {
    this._ctx.clearRect(0, 0, this._cWidth, this._cHeight);

    const hr = Timer.time.getHours() * 60 * 60 * 1000,
          min = Timer.time.getMinutes() * 60 * 1000,
          sec = Timer.time.getSeconds() * 1000,
          mSec = Timer.time.getMilliseconds();
    
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

    this._ctx.lineWidth = minMax(this._cWidth / 83, 4, 6);

    const n = 60;
    range(n).forEach((_, idx) => {
      let rad = ((2 * Math.PI) / n) * idx;
      
      if (idx % 5 === 0) this._ctx.strokeStyle = '#fff';
      else this._ctx.strokeStyle = '#5c5c5c';

      this._ctx.rotate(rad);
      this._ctx.beginPath();
      this._ctx.moveTo(0, - this._radius / 0.94);
      this._ctx.lineTo(0, - this._radius );
      this._ctx.stroke();
      this._ctx.rotate(-rad);
    })

    this._ctx.save();
    this._ctx.restore();
  }

  drawHourNums() {
    const fontSize = this._cWidth / 10;
    this._ctx.font = `${fontSize}px "sans-serif"`;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";
    this._ctx.fillStyle = "#fff";

    range(12).forEach((_, idx) => {
      let rad = ((2 * Math.PI) / 12) * (idx - 2);
      let x = Math.cos(rad) * (this._radius - fontSize / 1.2);
      let y = Math.sin(rad) * (this._radius - fontSize / 1.2);
      this._ctx.beginPath();
      this._ctx.fillText(String(idx + 1), x + 3, y + 2);
    });
  }

  drawCentralPointer() {
    this._ctx.beginPath();
    this._ctx.fillStyle = "#fff";
    this._ctx.arc(0, 0, minMax(this._cWidth / 30, 10, 18), 0, 2 * Math.PI);
    this._ctx.fill();

    this._ctx.beginPath();
    this._ctx.fillStyle = "#F79A09";
    this._ctx.arc(0, 0, minMax(this._cWidth / 50, 6, 14), 0, 2 * Math.PI);
    this._ctx.fill();
  }

  /**
   * @param {number} miliSeconds
   */
  drawHourIndicator(miliSeconds) {
    const rad = ((2 * Math.PI) / (12 * 60 * 60 * 1000)) * miliSeconds;
    
    this._ctx.save();
    this._ctx.rotate(rad);
    this._ctx.lineCap = "round";
    this._ctx.strokeStyle = '#fff';
    this._ctx.shadowColor = 'rgba(0,0,0,0.15)';
    this._ctx.shadowBlur = 10;

    this._ctx.beginPath();
    this._ctx.lineWidth = minMax(this._cWidth / 64, 8, 16);
    this._ctx.moveTo(0, 0);
    this._ctx.lineTo(0, - this._radius / 1.6);
    this._ctx.stroke();
    
    this._ctx.beginPath();
    this._ctx.lineWidth = minMax(this._cWidth / 32, 12, 20);
    this._ctx.moveTo(0, - this._radius / 6);
    this._ctx.lineTo(0, - this._radius / 1.6);
    this._ctx.stroke();

    this._ctx.restore();
  }

  /**
   * @param {number} miliSeconds
   */
  drawMinuteIndicator(miliSeconds) {
    const rad = ((2 * Math.PI) / (60 * 60 * 1000)) * miliSeconds;

    this._ctx.save();

    this._ctx.rotate(rad);
    this._ctx.lineCap = "round";
    this._ctx.strokeStyle = '#fff';

    this._ctx.beginPath();
    this._ctx.shadowColor = 'rgba(0,0,0,0.5)';
    this._ctx.shadowBlur = 10;
    this._ctx.lineWidth = minMax(this._cWidth / 64, 8, 16);
    this._ctx.moveTo(0, 0);
    this._ctx.lineTo(0, - this._radius / 1.01);
    this._ctx.stroke();

    this._ctx.beginPath();
    this._ctx.lineWidth = minMax(this._cWidth / 32, 12, 20);
    this._ctx.moveTo(0, - this._radius / 6);
    this._ctx.lineTo(0, - this._radius / 0.98);
    this._ctx.stroke();

    this._ctx.restore();
  }

  /**
   * @param {number} miliSeconds
   */
  drawSecondIndicator(miliSeconds) {
    const rad = ((2 * Math.PI) / (60 * 1000)) * miliSeconds;
    
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
    this._ctx.lineTo(0, - this._radius / 0.94);
    this._ctx.stroke();
    this._ctx.restore();

    this._ctx.beginPath();
    this._ctx.fillStyle = "#000";
    this._ctx.arc(0, 0, minMax(this._cWidth / 90, 4, 8), 0, 2 * Math.PI);
    this._ctx.fill();
  }

  setStates() {
    const w = Math.min(this._root.offsetWidth, this._root.offsetHeight);

    this._canvas.width = w;
    this._canvas.height = w;
    this._cWidth = w;
    this._cHeight = w;

    this._radius = this._cWidth / 2 - 32;
  }
}

class TimerUiText1 extends SubscribeComponent {
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
      /** @type {HTMLElement} */ (this.querySelector(".ios-timer--text1 .hour span:nth-child(1)")),
      /** @type {HTMLElement} */ (this.querySelector(".ios-timer--text1 .hour span:nth-child(2)")),
      /** @type {HTMLElement} */ (this.querySelector(".ios-timer--text1 .minute span:nth-child(1)")),
      /** @type {HTMLElement} */ (this.querySelector(".ios-timer--text1 .minute span:nth-child(2)"))
    ];

    const dateElem = /** @type {HTMLElement} */ (this.querySelector(".ios-timer--text1 .ios-timer--date-container .date-temp .date"));
    const tempElem = /** @type {HTMLElement} */ (this.querySelector(".ios-timer--text1 .ios-timer--date-container .date-temp .temp"));

    /**
     * @param {number} num 
     * @returns {string[]}
     */
    const parseTime = (num) => ("0" + num).slice(-2).split('');
    /**
     * @param {Date} date 
     */
    const draw = (date) => {
      const textList = [
        ...parseTime(date.getHours()),
        ...parseTime(date.getMinutes())
      ];

      Promise.all(range(4).map(async (_, i) => {
        const elem = timeElems[i];

        if (elem.textContent === textList[i]) return;
        
        iosFadeOut(elem, "y-fade");
        await delay();
        elem.textContent = String(textList[i]);
        iosFadeIn(elem, "y-fade");
      }));


      const day = date.toLocaleDateString(navigator.language, { weekday: 'long' });

      dateElem.innerHTML = `
        <p>${date.getDate()}일 (<span>${day}</span>)</p>
      `;
    }

    this.addSubscribeHandler("timer/update", async (e) => {
      draw(e.detail);
    });

    Timer.subscribe(this);

    draw(Timer.time);

    /**
     * @param {number | null} t 
     */
    const renderTemp = async (t) => {
      iosFadeOut(tempElem);
      await delay();
      tempElem.textContent = `${t ? Math.round(t) : "--"}°C`;
      iosFadeIn(tempElem);
    }

    this.addSubscribeHandler("weather/update",(e) => {
      renderTemp(e.detail.main.temp);
    });

    Weather.subscribe(this);

    renderTemp(null);
  }
}

customElements.define('app-timer-rect', TimerUiRectClock);

customElements.define('app-timer-circle', TimerUiCircleClock);

customElements.define('app-timer-text1', TimerUiText1);