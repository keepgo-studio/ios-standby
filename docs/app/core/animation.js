// @ts-check

import { isMobile, minMax, range } from "../../utils.js";

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
 *    SCALE_INIT: number;
 *    OPACITY_INIT: number;
 *    listUi: boolean;
 *    infinite: boolean;
 * }} [initObj]
 */
export function addSwitchAnimation(root, direction, initObj = { OPACITY_INIT: 0, SCALE_INIT: 0.6, listUi: false, infinite: false }) {
  // init, setting Environment and Global Variable
  root.classList.add("ios-switch--container");
  
  [...root.children].forEach((elem) => elem.classList.add("ios-switch--item"));

  let GIdx = 1, GLifeCycle = false, GLength, GScrollRef, GTotalLength;
  const GWindowResizeCallbackList = [];

  root.style.overflow = 'hidden';
  if (direction === 'horizontal') {
    GLength = root.offsetWidth;
    GScrollRef = 'scrollLeft';
    root.style.flexWrap = 'nowrap';
  } else {
    GLength = root.offsetHeight;
    GScrollRef = 'scrollTop';
    root.style.flexDirection = 'column';
  }
  
  GWindowResizeCallbackList.push(() => {
    GLength = direction === 'horizontal' ? root.offsetWidth : root.offsetHeight;
  });

  const SPRING_RATIO = 0.3;
  /**
   * @param {number} _idx 
   * @returns {number}
   */
  function getScrollPositionByIdx(_idx) {
    if (initObj.infinite) {
      return GLength * _idx;
    }

    if (_idx === 0) return 0;
    return (SPRING_RATIO + _idx - 1) * GLength;
  }

  if(!initObj.infinite) {
    /**
     * add dummy div for spring like scroll animation
     * check the idx range from {@link updateIdx}
     */
    const div1 = document.createElement('div'),
          div2 = document.createElement('div');

    div1.className = 'ios-switch--dummy';
    div1.style.width = SPRING_RATIO * GLength + "px";
    div1.style.height = SPRING_RATIO * GLength + "px";
    
    div2.className = 'ios-switch--dummy';
    div2.style.width = SPRING_RATIO * GLength + "px";
    div2.style.height = SPRING_RATIO * GLength + "px";

    root.insertBefore(div1, root.firstChild);
    root.appendChild(div2);

    GWindowResizeCallbackList.push(() => {
      div1.style.width = SPRING_RATIO * GLength + "px";
      div1.style.height = SPRING_RATIO * GLength + "px";
      div2.style.width = SPRING_RATIO * GLength + "px";
      div2.style.height = SPRING_RATIO * GLength + "px";
    });
  } else {
    const fc = /** @type {Node} */ (root.firstElementChild?.cloneNode(true)),
          lc = /** @type {Node} */ (root.lastElementChild?.cloneNode(true));
    
    root.insertBefore(lc, root.firstChild);
    root.appendChild(fc);

    function animateScroll() {
      if (root[GScrollRef] === 0) {
        root[GScrollRef] = getScrollPositionByIdx(N - 2);
      } else if (root[GScrollRef] === GTotalLength) {
        root[GScrollRef] = getScrollPositionByIdx(1);
      }
      
      requestAnimationFrame(animateScroll);
    }

    requestAnimationFrame(animateScroll);
  }
    
  const N = root.children.length;
  const GCoor = new MouseCoor();
  const GScrollEndCallbackList = [];
  const GChildrenIdxMap = [...root.children].reduce((prev, curr, i) => prev.set(curr, i), new Map());
  
  GTotalLength = initObj.infinite ? GLength * (N - 1) : GLength * (N - 3 + SPRING_RATIO * 2);
  GWindowResizeCallbackList.push(() => {
    GTotalLength = initObj.infinite ? GLength * (N - 1) : GLength * (N - 3 + SPRING_RATIO * 2);
  });
// ---------------------------------------------------------------
  const ioForGIdxUpdate = new IntersectionObserver((entries) => entries.forEach((info) => {
    const i = GChildrenIdxMap.get(info.target);
    if (i !== GIdx && info.isIntersecting) GIdx = i;
  }), {
    threshold: isMobile() ? 0.1 : 0.4
  });

  GChildrenIdxMap.forEach((i, elem) => {
    if (!initObj.infinite && (i === 0 || i === N - 1)) return;
    ioForGIdxUpdate.observe(elem);
  });


  /**
   * @param {number} dest
   * @param {number} duration
   * 
   * @description
   * 
   * https://gist.github.com/markgoodyear/9496715
   */
  function moveTo(dest, duration) {
    const from = root[GScrollRef],
      start = Date.now();

    function scroll() {
      if (!GLifeCycle) return;
      const currentTime = Date.now(),
        time = Math.min(1, ((currentTime - start) / duration)),
        easedT = Ease.easeOutExpo(time);

      root[GScrollRef] = (easedT * (dest - from)) + from;

      if (time < 1) requestAnimationFrame(scroll);
      else GScrollEndCallbackList.forEach((_cb) => _cb());
    }

    requestAnimationFrame(scroll);
  }

// ---------------------------------------------------------------

// event handler for PC
  let GMoveStart = false;

  /**
   * @param {number} dx 
   * @param {number} dy 
   * @return {'horizontal' | 'vertical'}
   */
  function getAngleType (dx, dy) {
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    if (angle > -45 && angle <= 45) {
      return 'horizontal';
    } else if (angle > 45 && angle <= 135) {
      return 'vertical';
    } else if (angle > 135 || angle <= -135) {
      return 'horizontal';
    }
    return 'vertical';
  }

  if (!isMobile()) {
    // moving start
    root.addEventListener('mousedown', (e) => {
      GLifeCycle = false;
      GCoor.setIsClickingOn(e.x, e.y);
    });

    // while moving
    root.addEventListener('mousemove', (e) => {
      if (GMoveStart) e.stopPropagation();

      GCoor.update(e.x, e.y, () => {
        const from = root[GScrollRef],
              cd = getAngleType(e.movementX, e.movementY),
              movement = e[`movement${direction === 'horizontal' ? 'X' : 'Y'}`];

        if (cd === direction) {
          GMoveStart = true;
          root[GScrollRef] = minMax(from + -movement, 0, GTotalLength);
        }
      });
    });

    // moving stop
    
    /** @param {MouseEvent} e */
    const handler = (e) => {
      GMoveStart = false;
      GLifeCycle = true;

      GCoor.update(e.x, e.y, () => moveTo(getScrollPositionByIdx(GIdx), 1000));
      GCoor.setIsClickingOff();
    };

    root.addEventListener('mouseup', handler);
    root.addEventListener('mouseleave', handler);
  }
// ---------------------------------------------------------------
// event handler for MOBILE
  else {
    root.addEventListener('touchstart', (e) => {
      const x = e.touches[0].clientX,
            y = e.touches[0].clientY;

      GLifeCycle = false;
      GCoor.setIsClickingOn(x, y);
    });

    root.addEventListener("touchmove", (e) => {
      if (GMoveStart) e.stopPropagation();

      const x = e.touches[0].clientX,
            y = e.touches[0].clientY;

      GCoor.update(x, y, () => {
        const from = root[GScrollRef];
        const dx = GCoor.x2 - GCoor.x1, 
              dy = GCoor.y2 - GCoor.y1,
              cd = getAngleType(dx, dy);

        let dis = direction === 'horizontal' ? dx : dy;

        if (direction === cd) {
          GMoveStart = true;
          root[GScrollRef] = minMax(from + -dis, 0, GTotalLength);
        }

        GCoor.setIsClickingOn(x, y);
      });
    })

    root.addEventListener('touchend', () => {
      GMoveStart = false;
      GLifeCycle = true;

      moveTo(getScrollPositionByIdx(GIdx), 1000);
      GCoor.setIsClickingOff();
    });
  }
// ---------------------------------------------------------------


// scroll event animation for each child
  const { OPACITY_INIT, SCALE_INIT } = initObj;
  /** @type {Map<Element, boolean>} */
  const showingMap = new Map();
  const coorList = range(N, 0);

  const ioForRenderTiming = new IntersectionObserver((entries) => entries.forEach(info => {
    let isShowing = info.isIntersecting;

    showingMap.set(info.target, isShowing);
  }));
  
  GChildrenIdxMap.forEach((i, elem) => {
    coorList[i] = getScrollPositionByIdx(i);

    // observe only 2 ~ N - 3
    if (1 < i && i < N - 2) {
      ioForRenderTiming.observe(elem);
      showingMap.set(elem, false);
    } 
    // 4 elements always render for smooth animation
    else {
      showingMap.set(elem, true);
    }

    // @ts-ignore
    elem.style.scale = String(SCALE_INIT); elem.style.opacity = String(OPACITY_INIT);
  });

  GWindowResizeCallbackList.push(() => {
    GChildrenIdxMap.forEach(i => coorList[i] = getScrollPositionByIdx(i));
  });

  /***
   * @param {number} i
   */
  function getRatio(i) {
    return Math.abs(coorList[i] - root[GScrollRef]);
  }

  /**
   * @param {Element} elem 
   * @param {number} i 
   */
  function styleChildByIdx(elem, i) {
    let dis;
    if (i === 0) { // sync style (0) <-> (N - 2)
      dis = Math.min(getRatio(0), getRatio(N - 2));
    } else if (i === N - 1) { // sync style (1) <-> (N - 2)
      dis = Math.min(getRatio(1), getRatio(N - 1));
    } else {
      dis = getRatio(i);
    }

    const ratio = minMax(dis, 0, GLength) / GLength;

    const alpha = 1 - ratio * (1 - SCALE_INIT), 
          beta = 1 - ratio * (1 - OPACITY_INIT);

    // @ts-ignore
    elem.style.scale = String(alpha); elem.style.opacity = String(beta);
  }

  function renderChildren() {
    GChildrenIdxMap.forEach((i, elem) => {
      const isShowing = showingMap.get(elem);

      if (!isShowing) return;

      styleChildByIdx(elem, i);
    });

    requestAnimationFrame(renderChildren);
  }

  requestAnimationFrame(renderChildren);
// ---------------------------------------------------------------


// list ui featuer
  if (initObj.listUi) {
    const listContainer = document.createElement('div');
    const listUl = document.createElement('ul');

    listContainer.className = 'ios-switch--list-container';

    function setLengthListContainer() {
      if (direction === 'horizontal') {
        listContainer.style.width = `${GTotalLength + GLength}px`;
      } else {
        listContainer.style.height = `${GTotalLength + GLength}px`;
      }
    }

    setLengthListContainer();
    GWindowResizeCallbackList.push(() => setLengthListContainer());
  
    listUl.className = 'ios-switch--list-ul';
    listUl.classList.add(direction === 'horizontal' ? 'hor' : 'ver');
    listUl.innerHTML = range(N - 2).map(() => `<li></li>`).join('\n');
  
    listContainer.append(listUl);
    root.append(listContainer);

    const listUlChildren = [...listUl.children];
    
    function renderList() {
      let currentIdx = GIdx;
      
      if (initObj.infinite) {
        if (currentIdx === N - 1) currentIdx = 1;
        else if (currentIdx === 0) currentIdx = N - 2;
      }

      listUlChildren.forEach((elem, _idx) => {
        if (currentIdx === _idx + 1) elem.classList.add("select");
        else elem.classList.remove("select");
      })
    }

    root.addEventListener("mousedown", () => {
      iosFadeIn(listContainer);
    });

    function animateList() {
      renderList();
      requestAnimationFrame(animateList);
    }

    requestAnimationFrame(animateList);

    GScrollEndCallbackList.push(() => iosFadeOut(listContainer));

    renderList();
  }
  // ---------------------------------------------------------------


  /**
   * @param {number} i 
   */
  function initScroll(i) {
    // as complicated style issue, the module need to set scroll position not immediately but later by 
    // using Web API from browser which has special process queue; Callback Queue.
    setTimeout(() => {
      GIdx = 1;
      root[GScrollRef] = getScrollPositionByIdx(1);
    });
  }
  
  GWindowResizeCallbackList.push(() => initScroll(1));

  window.addEventListener('resize', () => GWindowResizeCallbackList.forEach(callback => {
    callback();
  }));

  initScroll(1);
}

/**
 * @typedef {'fade' | 'y-fade'} FadeType
 */

/**
 * @param {FadeType} mode 
 */
function getFadeClass(mode) {
  let appearClassName = '', disappearClassName = '';

  switch(mode) {
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

/**
 * @param {Element} elem 
 * @param {FadeType} [mode]
 */
export function iosFadeIn(elem, mode = 'fade') {
  const [a, d] = getFadeClass(mode);
  
  elem.classList.remove(d)
  elem.classList.add(a);
}

/**
 * @param {Element} elem 
 * @param {FadeType} [mode]
 */
export function iosFadeOut(elem, mode = 'fade') {
  const [a, d] = getFadeClass(mode);

  elem.classList.remove(a);
  elem.classList.add(d);
}