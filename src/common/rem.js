function flex(fontSize = 100, scale = 1) {
  const ua = navigator.userAgent,
    matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i),
    uc = ua.match(/U3\/((\d+|\.){5,})/i),
    c = uc && parseInt(uc[1].split(".").join(""), 10) >= 80,
    isIOS = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
  const isAndroid = !!matches;
  let dpr = window.devicePixelRatio || 1;
  if (!isIOS && !(matches && matches[1] > 534) && !c) dpr = 1;
  var u = 1 / dpr;
  let m = document.querySelector('meta[name="viewport"]')
  if (!m) {
    window.createElement('meta');
    window.head.appendChild(m);
  }
  m.setAttribute('name', 'viewport');
  m.setAttribute("content", "width=device-width,user-scalable=no,initial-scale=" + u + ",maximum-scale=" + u + ",minimum-scale=" + u);
  const width = document.documentElement.getBoundingClientRect().width;
  let baseSize = (width / 750) * fontSize;
  if (!(isIOS || isAndroid) && width * u > 525) baseSize = ((525 / scale) / 750) * fontSize
  document.documentElement.style.fontSize = baseSize + "px";
}

flex(100, 1);
