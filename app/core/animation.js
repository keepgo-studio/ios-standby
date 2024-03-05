// @ts-check

import { isMobile, minMax } from "../../utils.js";

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


  let idx = 0;
  let lifeCycle = false;

  root.style.overflowX = isMobile() ? 'auto' : 'hidden';
  root.style.overflowY = 'hidden';
  /**
   * ------------------------
   * event handler for PC
   * ------------------------
   */
  if (!isMobile()) {
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

    const THRESHOLD = WIDTH / 3;
    
    function updateIdx() {
      const dist = Math.abs(COOR.x1 - COOR.x2);

      if (THRESHOLD <= dist) {
        const d = COOR.x2 - COOR.x1 > 0 ? -1 : 1;
        idx = minMax(idx + d, 0, N - 1);
      }
    }

    // moving start
    root.addEventListener('mousedown', (e) => {
      lifeCycle = false;
      COOR.setIsClickingOn(e.x);
    });

    // while moving

    root.addEventListener('mousemove', (e) => {
      COOR.update(e.x, undefined, () => {
        const from = root.scrollLeft;

        root.scrollLeft = minMax(from + -e.movementX, 0, WIDTH);
      });
    });

    // moving stop
    root.addEventListener('mouseup', () => {
      lifeCycle = true;
      COOR.setIsClickingOff();

      updateIdx();
      moveTo(WIDTH * idx, 1000);
    });

    root.addEventListener('mouseleave', (e) => {
      lifeCycle = true;
      COOR.setIsClickingOff();

      COOR.x2 = e.x;
      updateIdx();
      moveTo(WIDTH * idx, 1000);
    });
  }
  /**
   * ------------------------
   * event handler for MOBILE
   * ------------------------
   */
  else {
    // root.addEventListener('touchstart', (e) => {
    //   coor.setIsClickingOn(e.touches[0].clientX);
    // })

    // root.addEventListener('touchmove', () => {
    // 
    // })
    // root.addEventListener('touchend', () => {
    //   coor.setIsClickingOff();
    // })
  }


  /**
   * ------------------------
   * scroll event animation for each child
   * ------------------------
   */
  // init
  const SCALE_INIT = 0.6, FILTER_INIT = 0;
  const children = [...root.children];
  const elemCoor = children.map((_, idx) => idx * WIDTH);

  children.forEach(elem => {
    // @ts-ignore
    elem.style.scale = SCALE_INIT;
    // @ts-ignore
    elem.style.filter = `brightness(${FILTER_INIT})`;
  });

  function renderChild() {
    children.forEach((elem, idx) => {
      const ratio = minMax(Math.abs(elemCoor[idx] - root.scrollLeft), 0, WIDTH) / WIDTH;
      // RATIO_INIT + (1 - RATIO_INIT) * (1 - ratio);
      const alpha = 1 - ratio * (1 - SCALE_INIT),
        beta = 1 - ratio * (1 - FILTER_INIT);
      // @ts-ignore
      elem.style.scale = alpha;
      // @ts-ignore
      elem.style.filter = `brightness(${beta})`;
    });

    requestAnimationFrame(renderChild);
  }

  requestAnimationFrame(renderChild);
}