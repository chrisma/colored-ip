$(document).ready(function(){
  $.getJSON("http://api.ipify.org?format=json", function (data) {
    if (!data.ip) {
      fail(data);
    } else {
      render(data);
    }
  }).fail(function(jqXHR, textStatus, errorThrown){
      fail(errorThrown);
  });
});

function fail(data) {
  $('.section').not('#header').remove();
  $('#header').html('Unfortunately there was an error retrieving your IP address :(<br> Sorry about that!');
  console.log('ERROR: ', data);
}

function render(data) {
  $("#ip").text(data.ip);
  var octets = data.ip.split('.').map(function(str){return parseInt(str);});
  percentages = octets.map(function(octet){
    return Math.round( (octet/255)*1000 ) / 1000;
  });

  //RGB
  var rgb = octets.slice(0,3);
  var rgbCss = 'rgb(' + rgb.join(',') + ')';
  $('#rgb').css('background-color', rgbCss);
  var closestRGB = closestColorName(rgb);
  $('#rgb_rgb').text(closestRGB.name);
  $('#rgb_rgb').css('color', getForegroundColor(rgb));
  $('.red').text(rgb[0]);
  $('.green').text(rgb[1]);
  $('.blue').text(rgb[2]);

  //RGBA
  var alpha = percentages[3];
  var rgbaCss = 'rgba(' + rgb.join(',') + ',' + alpha + ')';
  $('#rgba').css('background-color', rgbaCss);
  $('#rgba_rgb').text(closestRGB.name + ' with ' + alpha*100 + '% transparency.');
  $('#rgba_rgb').css('color', getForegroundColor(rgb, alpha));
  $('.alpha').text(alpha);

  //HSL
  //         hue (0-360),        saturation (0-100), lightness (0-100)
  var hsl = [percentages[0]*360, percentages[1]*100, percentages[2]*100];
  var hslInrgb = colorConvert.hsl2rgb(hsl).map(Math.round);
  $('#hsl').css('background-color', 'rgb(' + hslInrgb.join(',') + ')');
  var closestHSL = closestColorName(hslInrgb);
  $('#hsl_rgb').text(closestHSL.name);
  $('#hsl_rgb').css('color', getForegroundColor(hslInrgb));
  $('.hue').text(trunc(hsl[0]));
  $('.saturation').text(hsl[1] + '%');
  $('.lightness' ).text(hsl[2] + '%');

  //HSLA
  $('#hsla').css('background-color', 'rgba(' + hslInrgb.join(',') + ',' + alpha + ')');
  $('#hsla_rgb').text(closestHSL.name + ' with ' + alpha*100 + '% transparency.');
  $('#hsla_rgb').css('color', getForegroundColor(hslInrgb, alpha));

  //HSV
  var hsv = hsl //same structure, different semantics: hue, saturation, value
  hsvInrgb = colorConvert.hsv2rgb(hsv).map(Math.round);
  $('#hsv').css('background-color', 'rgb(' + hsvInrgb.join(',') + ')');
  var closestHSV = closestColorName(hsvInrgb);
  $('#hsv_rgb').text(closestHSV.name);
  $('#hsv_rgb').css('color', getForegroundColor(hsvInrgb));

  //HWB
  var hwb = hsl //same structure, different semantics: hue, whiteness, blackness
  hwbInrgb = colorConvert.hwb2rgb(hsv).map(Math.round);
  $('#hwb').css('background-color', 'rgb(' + hwbInrgb.join(',') + ')');
  var closestHWB = closestColorName(hwbInrgb);
  $('#hwb_rgb').text(closestHWB.name);
  $('#hwb_rgb').css('color', getForegroundColor(hwbInrgb));

  //CMYK
  var cmyk = percentages.map(function(p){return p*100;}); //CMYK is 4 values 0-100%
  cmykInrgb = colorConvert.cmyk2rgb(cmyk).map(Math.round);
  $('#cmyk').css('background-color', 'rgb(' + cmykInrgb.join(',') + ')');
  var closestCMYK = closestColorName(cmykInrgb);
  $('#cmyk_rgb').text(closestCMYK.name);
  $('#cmyk_rgb').css('color', getForegroundColor(cmykInrgb));
  $('.cyan').text(trunc(cmyk[0]) + '%');
  $('.magenta').text(cmyk[1] + '%');
  $('.yellow').text(cmyk[2] + '%');
  $('.key').text(cmyk[3] + '%');
}

function getForegroundColor(rgb, alpha) {
    var yiq = ((rgb[0]*299)+(rgb[1]*587)+(rgb[2]*114))/1000;
    if (yiq >= 128) {
       return 'black'
    }
    if (alpha) {
      return (alpha > 0.5) ? 'white': 'black';
    }
    return 'white'
}

function trunc(number) {
  return Math.round(number * 10) / 10
}
