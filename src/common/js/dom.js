export function getData(el, attr, val) {
  const name = `data-${attr}`
  if (val) {
    return el.setAttribute(name, val);
  } else {
    return el.getAttribute(name);
  }
}