export default function jsonp(url, opts) {
  return new Promise((resolve, reject) => {
    let count = 0;
    const {
      prefix = '__jp',
      param = 'callback',
      timeout = 60000,
      data = {}
    } = opts;
    let name = prefix + count++;
    let timer;
    function cleanup() {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
        window[name] = null;
        if (timer) {
          clearTimeout(timer);
        }
      }
    }
    if (timeout) {
      timer = setTimeout(() => {
        cleanup();
        reject('timeout');
      }, timeout);
    }
    window[name] = res => {
      if (window[name]) {
        cleanup();
      }
      resolve(res);
    }
    let str = '';
    for (const key in data) {
      const value = data[key] !== undefined ? data[key] : '';
      str += `&${key}=${encodeURIComponent(value)}`;
    }
    url = url + (url.indexOf('?') > 0 ? '' : '?') + str.substr(1);
    url = `${url}&${param}=${name}`;
    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
  })
}

// 作者：飞跃疯人院
// 链接：https://juejin.im/post/5c7e89d65188255dce5dda11
// 来源：掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

/* 示例

const opts = {
  data: {
    g_tk: 1928093487,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp',
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  },
  param: 'jsonpCallback'
}

jsonp(url, opts)
  .then(res => {
    console.log(res);
  })
  .catch(ex => {
    console.log(ex);
  })

*/