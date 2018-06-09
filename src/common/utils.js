export function isNil(obj) {
  return typeof obj === 'undefined' || obj === null;
}

export function isEmptyArray(arr) {
  return isNil(arr) || arr.length === 0;
}

export function isInViewport(node, offset = 0, x = true) {
  const { top, right, bottom, left, width, height } = node.getBoundingClientRect();
  const { clientWidth, clientHeight } = document.documentElement;
  // width > 0 || height > 0 is to fix "display: none"
  return (width > 0 || height > 0) && bottom >= -offset && top < (clientHeight + offset) &&
    (!x || (right >= -offset && left < (clientWidth + offset)));
}

export function debounce(fn, delay = 0) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  }
}
