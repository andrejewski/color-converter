
function rgbToHex(rgb) {
  var hex = rgb
    .map(function(x) { return x.toString(16); })
    .map(function(x) {
      return x.length === 2 ? x : '0' + x;
    })
    .join('');
  return [hex];
}

function hexToRgb(_hex) {
  var hex = _hex[0] || '';
  if(hex.charAt(0) === '#') hex = hex.slice(1);
  if(hex.length === 0) hex = '0';
  if(hex.length === 1) hex += hex;
  if(hex.length === 2) hex += hex + hex;
  if(hex.length === 3) {
    hex = hex
      .split('')
      .map(function(x) { return x + x; })
      .join('');
  }
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ];
}

function rgbToRgb(rgb) {
  return rgb.map(function(x) {
    x = x || 0;
    if(typeof x === 'number') return x;
    return parseInt(x.trim(), 10);
  });
}

function rgbToCmyk(rgb) {
  var max = rgb.reduce(function(x,y) { return Math.max(x,y); });
  if(max === 0) return [0, 0, 0, 1];
  var cmy = rgb.map(function(x) { return 1 - (x/255); });
  var min = cmy.reduce(function(x,y) { return Math.min(x,y); });
  return cmy
    .map(function(x) {
      return ((x - min)/(1 - min)).toFixed(4);
    })
    .concat(min.toFixed(4));
}

function cmykToRgb(cmyk) {
  var k = cmyk.pop();
  return cmyk.map(function(c) {
    return Math.floor (255 * (1-c) * (1-k));
  });
}

function rgbToHsv(_rgb) {
  var rgb = _rgb.map(function(x) {return x/255;});
  var max = rgb.reduce(function(x,y) { return Math.max(x,y); });
  var min = rgb.reduce(function(x,y) { return Math.min(x,y); });
  if(min === max) return [0, 0, min];
  var delta, height;
  switch(min) {
    case rgb[0]:
      delta = rgb[1] - rgb[2];
      height = 3;
      break;
    case rgb[1]:
      delta = rgb[2] - rgb[0];
      height = 1; 
      break;
    case rgb[2]:
      delta = rgb[0] - rgb[1];
      height = 5; 
      break;
  }
  return [
    (60*((height - delta)/(max - min))).toFixed(1),
    ((max - min)/max).toFixed(4),
    max.toFixed(4)
  ];
}

function hsvToRgb(hsv) {
  var h = hsv[0];
  var c = hsv[1] * hsv[2];
  var x = c * (1 - Math.abs(((hsv[0]/60) % 2 - 1)));
  var m = hsv[2] - c;
  return (function() {
    if(h < 60 )	return [c,x,0];
		if(h < 120) return [x,c,0];
		if(h < 180)	return [0,c,x];
		if(h < 240) return [0,x,c];
		if(h < 300) return [x,0,c];
		if(h < 360)	return [c,0,x];
  })()
  .map(function(x) { return x + m; });
}

function format(str, rgb) {
  var hex = rgbToHex(rgb);
  var cmyk = rgbToCmyk(rgb);
  var hsv = rgbToHsv(rgb);
  var flags = {
    x: hex[0],
    r: rgb[0],
    g: rgb[1],
    b: rgb[2],
    c: cmyk[0],
    m: cmyk[1],
    y: cmyk[2],
    k: cmyk[3],
    h: hsv[0],
    s: hsv[1],
    v: hsv[2],
  };

  return str.replace(/(%)(.?)/g, function(f) {
    return flags[f.slice(1)];
  });
}

var color = {
  hexToRgb: hexToRgb,
  rgbToHex: rgbToHex,
  rgbToRgb: rgbToRgb,
  cmykToRgb: cmykToRgb,
  rgbToCmyk: rgbToCmyk,
  hsvToRgb: hsvToRgb,
  rgbToHsv: rgbToHsv,

  format: format,
};

