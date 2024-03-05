// @ts-check

import { minMax, range } from "../../utils.js";
import Component from "../core/component.js";
import { Timer } from "./timer.js";

class TimerUiRectClock {



}
class TimerUiTextClock {



}

class TimerUiCircleClock extends Component {
  _lifeCycle = true;
  /** @type {CanvasRenderingContext2D} */
  _ctx;
  /** @type {number} */
  _cWidth;
  /** @type {number} */
  _cHeight;
  /** @type {number} */
  _radius;

  render() {
    this.innerHTML = `
      <section id="circle-clock">
        <canvas></canvas>
      </section>
    `;
  }

  // https://codepen.io/sylaryip/pen/zYZxxyv?editors=1010
  draw() {
    this._ctx.clearRect(0, 0, this._cWidth, this._cHeight);

    const hr = Timer.time.getHours(),
          min = Timer.time.getMinutes(),
          sec = Timer.time.getSeconds(),
          mSec = Timer.time.getMilliseconds();
    
    this._ctx.save();
    this.drawPanel();
    this.drawHourNums();
    this.drawPointers();

    this.drawHourIndicator(mSec + sec * 1000 + min * 1000 * 60 + hr * 1000 * 60 * 60);
    this.drawMinuteIndicator(mSec + sec * 1000 + min * 1000 * 60);
    this.drawCentralPointer();
    this.drawSecondIndicator(mSec + sec * 1000);
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
      
      if (idx % 12 === 0) this._ctx.strokeStyle = '#fff';
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
    this._ctx.font = `${fontSize}px sf pro, sans-serif`;
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

  animation() {
    if (this._lifeCycle) this.draw();

    requestAnimationFrame(this.animation.bind(this));
  }

  connectedCallback() {
    const root = /** @type {HTMLCanvasElement} */ (this.querySelector("#circle-clock"));
    const canvas = /** @type {HTMLCanvasElement} */ (this.querySelector("#circle-clock canvas"));
    const ctx = /** @type {any} */ (canvas.getContext('2d'));
    
    const w = Math.min(root.offsetWidth, root.offsetHeight);

    canvas.width = w;
    canvas.height = w;
    this._cWidth = w;
    this._cHeight = w;

    this._radius = this._cWidth / 2 - 24;
    this._ctx = ctx;
    
    this.draw();

    requestAnimationFrame(this.animation.bind(this));
  }
}

customElements.define('app-timer-circle', TimerUiCircleClock);