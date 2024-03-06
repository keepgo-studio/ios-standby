export function isMobile() {
  return Boolean(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
}

/**
 * 
 * @param {number} n 
 * @param {any} [val] 
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
  if (x < 0) return min;
  else if (x > max) return max;
  return x;
}