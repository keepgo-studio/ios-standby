export function isMobile() {
  return Boolean(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
}