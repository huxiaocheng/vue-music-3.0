export function getData(el, attr, val) {
  const name = `data-${attr}`
  if (val) {
    return el.setAttribute(name, val);
  } else {
    return el.getAttribute(name);
  }
}

const elementStyle = document.createElement('div').style
const vendor = (() => {
  const transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  };
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] != null) {
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (!vendor) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.slice(1);
}
