// @ts-check

import { IOS_DURATION } from "./vars.js";

export function isMobile() {
  return Boolean(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
}


/**
 * @template T
 * @param {number} n 
 * @param {T} [val] 
 * @returns {T[]}
 */
export function range(n, val = undefined) {
  return Array(n).fill(val);
}


/**
 * 
 * @param {number} x 
 * @param {number} min 
 * @param {number} max
 */
export function minMax(x, min, max) {
  if (x < min) return min;
  else if (x > max) return max;
  return x;
}

/**
 * @param {number} [n] 
 */
export function delay(n = IOS_DURATION) {
  return new Promise(res => setTimeout(() => res(true), n));
}

export function isInIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}