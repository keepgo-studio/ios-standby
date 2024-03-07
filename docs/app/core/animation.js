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
 * @param {'horizontal' | 'vertical'} direction
 * @param {{
 *    SCALE_INIT?: number;
 *    OPACITY_INIT?: number;
 * }} [initObj]
 */
export function addSwitchAnimation(root, direction, initObj = { OPACITY_INIT: 0, SCALE_INIT: 0.6 }) {
  root.classList.add("ios-switch--container");
  
  [...root.children].forEach((elem) => elem.classList.add("ios-switch--item"));

  let idx = 0;
  let lifeCycle = false;

  var LENGTH, SCROLL_REF, TOTAL_LENGTH;

  if (direction === 'horizontal') {
    LENGTH = root.offsetWidth;
    SCROLL_REF = 'scrollLeft';

    root.style.overflowX = isMobile() ? 'auto' : 'hidden';
    root.style.overflowY = 'hidden';
    root.style.flexWrap = 'nowrap';
  } else {
    LENGTH = root.offsetHeight;
    SCROLL_REF = 'scrollTop';

    root.style.overflowX = 'hidden';
    root.style.overflowY = isMobile() ? 'auto' : 'hidden';
    root.style.flexDirection = 'column';
  }

// Global Variable setting
  /**
   * 
   * @param {number} idx 
   * @returns {number}
   */
  function getScrollPositionByIdx(idx) {
    return LENGTH * (idx + 0.5);
  }
    
  const N = root.children.length;
  const COOR = new MouseCoor();
  const THRESHOLD = LENGTH / 2.5;
  TOTAL_LENGTH = LENGTH * N;
// ---------------------------------------------------------------

  /**
   * @param {number} dest
   * @param {number} duration
   * 
   * @description
   * 
   * https://gist.github.com/markgoodyear/9496715
   */
  function moveTo(dest, duration) {
    const from = root[SCROLL_REF],
      start = Date.now();

    function scroll() {
      if (!lifeCycle) return;

      const currentTime = Date.now(),
        time = Math.min(1, ((currentTime - start) / duration)),
        easedT = Ease.easeOutExpo(time);

      root[SCROLL_REF] = (easedT * (dest - from)) + from;

      if (time < 1) requestAnimationFrame(scroll);
      // else -> callback
    }

    requestAnimationFrame(scroll);
  }

  function updateIdx() {
    const dist = direction === 'horizontal' ? (COOR.x2 - COOR.x1) : (COOR.y2 - COOR.y1);

    if (THRESHOLD <= Math.abs(dist)) {
      const d = dist > 0 ? -1 : 1;
      idx = minMax(idx + d, 0, N - 1);
    }
  }
// ---------------------------------------------------------------

// event handler for PC
  if (!isMobile()) {
    // moving start
    root.addEventListener('mousedown', (e) => {
      lifeCycle = false;
      COOR.setIsClickingOn(e.x, e.y);
    });

    // while moving
    root.addEventListener('mousemove', (e) => {
      e.stopPropagation();
      COOR.update(e.x, e.y, () => {
        const from = root[SCROLL_REF];
        const movement = e[`movement${direction === 'horizontal' ? 'X' : 'Y'}`];

        root[SCROLL_REF] = minMax(from + -movement, 0, TOTAL_LENGTH);
      });
    });

    // moving stop
    root.addEventListener('mouseup', (e) => {
      lifeCycle = true;

      COOR.update(e.x, e.y, () => {
        updateIdx();
        moveTo(getScrollPositionByIdx(idx), 1000);
      });

      COOR.setIsClickingOff();
    });
    root.addEventListener('mouseleave', (e) => {
      lifeCycle = true;

      COOR.update(e.x, e.y, () => {
        updateIdx();
        moveTo(getScrollPositionByIdx(idx), 1000);
      });

      COOR.setIsClickingOff();
    });
  }
// ---------------------------------------------------------------
// event handler for MOBILE
  else {
    // root.addEventListener('touchstart', (e) => {
    //   if (!bubble) e.stopPropagation();

    //   const x = e.touches[0].clientX,
    //         y = e.touches[0].clientY;

    //   lifeCycle = false;
    //   COOR.setIsClickingOn(x, y);
    // })

    // root.addEventListener('touchmove', (e) => {
    //   if (!bubble) e.stopPropagation();

    //   const x = e.touches[0].clientX,
    //         y = e.touches[0].clientY;

    //   COOR.update(x, y);
    // })
    // root.addEventListener('touchend', (e) => {
    //   if (!bubble) e.stopPropagation();

    //   lifeCycle = true;
    //   updateIdx();
    //   moveTo(LENGTH * idx, 1000);

    //   COOR.setIsClickingOff();
    // })
  }
// ---------------------------------------------------------------


// scroll event animation for each child
  const { OPACITY_INIT, SCALE_INIT } = initObj;
  const children = [...root.children];
  const elemCoor = children.map((_, idx) => getScrollPositionByIdx(idx));

  children.forEach(elem => {
    // @ts-ignore
    elem.style.scale = SCALE_INIT;
    // @ts-ignore
    elem.style.filter = `brightness(${OPACITY_INIT})`;
  });

  function renderChild() {
    children.forEach((elem, idx) => {
      const ratio = minMax(Math.abs(elemCoor[idx] - root[SCROLL_REF]), 0, LENGTH) / LENGTH;
      // RATIO_INIT + (1 - RATIO_INIT) * (1 - ratio);
      // @ts-ignore
      const alpha = 1 - ratio * (1 - SCALE_INIT), beta = 1 - ratio * (1 - OPACITY_INIT);
      // @ts-ignore
      elem.style.scale = alpha;
      // @ts-ignore
      elem.style.filter = `brightness(${beta})`;
    });

    requestAnimationFrame(renderChild);
  }

  requestAnimationFrame(renderChild);

// ---------------------------------------------------------------

  /**
   * add dummy div for spring like scroll animation
   * check the idx range from {@link updateIdx}
   */
  const div1 = document.createElement('div'),
  div2 = document.createElement('div');
  div1.className = 'ios-switch--dummy';
  div2.className = 'ios-switch--dummy';

  root.insertBefore(div1, root.firstChild);
  root.appendChild(div2);

  setTimeout(() => {
    root[SCROLL_REF] = getScrollPositionByIdx(0);
  });
}

/**
 * @param {Element} elem 
 */
export function iosFadeIn(elem) {
  elem.classList.remove('ios-disappear')
  elem.classList.add('ios-appear');
}

/**
 * @param {Element} elem 
 */
export function iosFadeOut(elem) {
  elem.classList.remove('ios-appear');
  elem.classList.add('ios-disappear')
}