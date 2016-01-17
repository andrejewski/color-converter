
// $ = require('jquery');
// color = require('./color');

$('#flag-list-toggle').on('click', function() {
  $('.flag-list-view').toggleClass('hidden');
  $('.custom-format-view').toggleClass('hidden');
});

$('.format-list li').on('click', function() {
  $('#custom').val($(this).text());
  customSetter(color.hexToRgb($('#hex').val()));
});

$('#custom').val('rgb(%r, %g, %b)');

function Val(inputSel, mirrorSel, writeOnly) {
  var value = null;
  var listeners = [];

  var $input = $(inputSel);
  var $mirrors = $(mirrorSel);

  function initialize() {
    value = $input.val();
    $input.on('keyup', function() {
      value = $input.val().trim();
      emitChange();
      reflect();
    });
    reflect();
  }

  function reflect() {
    $mirrors.text($input.val());
  }

  function set(_value) {
    // console.log('set', $input, _value);
    value = _value;
    $input.val(value);
    reflect();
  }

  function get() {
    return value;
  }

  function listen(listener) {
    listeners.push(listener);
  }

  function emitChange() {
    // console.log('change', inputSel);
    listeners.forEach(function(f) {
      f();
    });
  }

  if(!writeOnly) initialize();
  return {
    get: get,
    set: set,
    listen: listen
  };
}

function ValGroup(vals, getter, setter) {
  var listeners = [];

  function initialize() {
    vals.forEach(function(val) {
      val.listen(emitChange);
    })
  }

  function listen(listener) {
    listeners.push(listener);
  }

  function emitChange() {
    listeners.forEach(function(f) {
      f();
    });
  }

  function get() {
    return getter(vals.map(function(val) {
      return val.get();
    }));
  }

  function set(values) {
    setter(values).forEach(function(value, index) {
      vals[index].set(value);
    });
  }

  initialize();
  return {
    get: get,
    set: set,
    listen: listen
  };
}

function junction(vals) {
  vals.forEach(function(sender) {
    var rest = vals.filter(function(val) {
      return val !== sender;
    });
    sender.listen(function() {
      rest.forEach(function(receiver) {
        receiver.set(sender.get());
      });
    });
  });
}

function customGetter() {
  // no-op
}

function customSetter(rgb) {
  var str = $('#custom').val();
  $('#output').text(color.format(str, rgb)); 
  $('.modal-container').css({
    backgroundColor: '#'+color.rgbToHex(rgb)
  });
  return [str];
}

junction([
  ValGroup([
    Val('#hex', '.hex-outlet'),
  ], color.hexToRgb, color.rgbToHex),
  ValGroup([
    Val('#rgb-r', '.rgb-r-outlet'),
    Val('#rgb-g', '.rgb-g-outlet'),
    Val('#rgb-b', '.rgb-b-outlet'),
  ], color.rgbToRgb, color.rgbToRgb),
  ValGroup([
    Val('#cmyk-c', '.cmky-c-outlet'),
    Val('#cmyk-m', '.cmky-m-outlet'),
    Val('#cmyk-y', '.cmky-y-outlet'),
    Val('#cmyk-k', '.cmky-k-outlet'),
  ], color.cmykToRgb, color.rgbToCmyk),
  ValGroup([
    Val('#hsv-h', '.hsv-h-outlet'),
    Val('#hsv-s', '.hsv-s-outlet'),
    Val('#hsv-v', '.hsv-v-outlet'),
  ], color.hsvToRgb, color.rgbToHsv),
  ValGroup([
    Val('#custom', '.custom-outlet', true),
  ], customGetter, customSetter),
]);

