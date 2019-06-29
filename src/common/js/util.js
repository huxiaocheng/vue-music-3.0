export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function throttle(fn, delay = 100) {
  let timer;
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  }
}
