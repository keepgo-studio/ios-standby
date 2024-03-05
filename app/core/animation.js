// @ts-check

import { isMobile } from "../../utils.js";

class Ease {
  static easeOutExpo = (/** @type {number} */ x) => { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); }
}

class MouseCoor {
  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;

  _isClicking = false;

  constructor() { }

  /**
   * 
   * @param {number} [x] 
   * @param {number} [y]
   */
  setIsClickingOn(x, y) {
    this._isClicking = true;

    if (x) this.x1 = x;
    if (y) this.y1 = y;
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
    if (!this._isClicking) return;

    if (x) this.x2 = x;
    if (y) this.y2 = y;

    if (callback) callback();
  }
}

/**
 * @param {HTMLElement} root 
 */
export function addSwitchAnimation(root) {
  const N = root.children.length;
  const WIDTH = root.offsetWidth;
  const COOR = new MouseCoor();

  root.classList.add("ios-switch--container");

  root.style.overflow = isMobile() ? 'auto' : 'hidden';

  let idx = 0;
  let lifeCycle = false;

  /**
   * @param {number} destX
   * @param {number} duration
   * 
   * @description
   * 
   * https://gist.github.com/markgoodyear/9496715
   */
  function moveTo(destX, duration) {
    const from = root.scrollLeft,
      start = Date.now();

    function scroll() {
      if (!lifeCycle) return;

      const currentTime = Date.now(),
        time = Math.min(1, ((currentTime - start) / duration)),
        easedT = Ease.easeOutExpo(time);

      root.scrollLeft = (easedT * (destX - from)) + from;

      if (time < 1) requestAnimationFrame(scroll);
      // else -> callback
    }

    requestAnimationFrame(scroll);
  }

  /**
   * 
   * @param {number} x 
   * @param {number} min 
   * @param {number} max
   */
  function filterX(x, min, max) {
    if (x < 0) return min;
    else if (x > max) return max;
    return x;
  }

  /**
   * ------------------------
   * event handler for PC
   * ------------------------
   */
  // moving start
  root.addEventListener('mousedown', (e) => {
    lifeCycle = false;
    COOR.setIsClickingOn(e.x);
  });

  // while moving
  const THRESHOLD = WIDTH / 3;

  root.addEventListener('mousemove', (e) => {
    COOR.update(e.x, undefined, () => {
      const from = root.scrollLeft;

      root.scrollLeft = filterX(from + -e.movementX, 0, WIDTH);
    });
  });

  // moving stop
  root.addEventListener('mouseup', () => {
    lifeCycle = true;
    COOR.setIsClickingOff();

    const dist = Math.abs(COOR.x1 - COOR.x2);
    if (THRESHOLD <= dist) {
      const d = COOR.x2 - COOR.x1 > 0 ? -1 : 1;

      idx = filterX(idx + d, 0, N - 1);
    }
    moveTo(WIDTH * idx, 1000);
  });

  root.addEventListener('mouseleave', () => {
    lifeCycle = true;

    COOR.setIsClickingOff();
    moveTo(WIDTH * idx, 1000);
  });


  /**
   * ------------------------
   * event handler for MOBILE
   * ------------------------
   */
  // root.addEventListener('touchstart', (e) => {
  //   coor.setIsClickingOn(e.touches[0].clientX);
  // })

  // root.addEventListener('touchmove', () => {
  // 
  // })
  // root.addEventListener('touchend', () => {
  //   coor.setIsClickingOff();
  // })


  /**
   * ------------------------
   * scroll event animation for each child
   * ------------------------
   */
  // init
  const RATIO_INIT = 0.6;
  const children = [...root.children];
  const elemCoor = children.map((_, idx) => idx * WIDTH);

  children.forEach(elem => {
    // @ts-ignore
    elem.style.scale = RATIO_INIT;
    // @ts-ignore
    elem.style.filter = `brightness(${RATIO_INIT})`;
  });

  function renderChild() {
    children.forEach((elem, idx) => {
      const ratio = filterX(Math.abs(elemCoor[idx] - root.scrollLeft), 0, WIDTH) / WIDTH;
      // RATIO_INIT + (1 - RATIO_INIT) * (1 - ratio);
      const alpha = 1 - ratio * (1 - RATIO_INIT);
      // @ts-ignore
      elem.style.scale = alpha;
      // @ts-ignore
      elem.style.filter = `brightness(${alpha})`;
    });

    requestAnimationFrame(renderChild);
  }

  requestAnimationFrame(renderChild);
}