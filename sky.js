/* h3lp sky: the colour of the sky over Toronto right now, from the sun's real position.
   It drives the thin horizon line at the top of the page and the Breathe sun.
   Pure maths: no DOM, no network, no storage. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.H3lpSky = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var RAD = Math.PI / 180;
  var TORONTO = { lat: 43.6532, lon: -79.3832 };

  /* Low-precision solar position (about 0.1 degree), good for colour and sunrise times. */
  function sun(date, lat, lon) {
    lat = lat == null ? TORONTO.lat : lat; lon = lon == null ? TORONTO.lon : lon;
    var d = date.getTime() / 86400000 - 10957.5;           /* days since J2000.0 */
    var g = (357.529 + 0.98560028 * d) * RAD;
    var q = 280.459 + 0.98564736 * d;
    var L = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD;
    var e = (23.439 - 0.00000036 * d) * RAD;
    var ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
    var dec = Math.asin(Math.sin(e) * Math.sin(L));
    var gmst = ((18.697374558 + 24.06570982441908 * d) % 24 + 24) % 24;
    var ha = (gmst * 15 + lon) * RAD - ra;
    var phi = lat * RAD;
    var alt = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(ha));
    var az = Math.atan2(-Math.sin(ha), Math.tan(dec) * Math.cos(phi) - Math.sin(phi) * Math.cos(ha));
    return { alt: alt / RAD, az: (az / RAD + 360) % 360 };
  }

  /* Keyframes by sun altitude: zenith side, middle sky, horizon glow, sun disc. */
  var K = [
    { a: -90, top: [24, 28, 60], mid: [32, 37, 74], glow: [50, 56, 102], sun: [78, 84, 128] },
    { a: -18, top: [26, 30, 64], mid: [35, 40, 80], glow: [58, 62, 110], sun: [92, 96, 140] },
    { a: -10, top: [28, 34, 70], mid: [45, 47, 90], glow: [90, 74, 115], sun: [150, 118, 150] },
    { a: -4, top: [39, 48, 100], mid: [90, 79, 126], glow: [215, 145, 124], sun: [239, 167, 127] },
    { a: 0, top: [60, 76, 130], mid: [185, 127, 134], glow: [242, 166, 110], sun: [246, 183, 116] },
    { a: 5, top: [110, 141, 183], mid: [230, 179, 145], glow: [245, 194, 124], sun: [248, 207, 138] },
    { a: 12, top: [141, 178, 210], mid: [201, 220, 230], glow: [243, 221, 168], sun: [247, 226, 174] },
    { a: 40, top: [147, 186, 216], mid: [207, 225, 234], glow: [242, 230, 194], sun: [246, 234, 198] },
    { a: 90, top: [147, 186, 216], mid: [207, 225, 234], glow: [242, 230, 194], sun: [246, 234, 198] }
  ];
  function mix(a, b, t) { return [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * t); }); }
  function hex(c) { return "#" + c.map(function (v) { return ("0" + v.toString(16)).slice(-2); }).join(""); }

  function phaseOf(alt, morning) {
    if (alt < -12) return "night";
    if (alt < -0.833) return morning ? "first-light" : "dusk";
    if (alt < 6) return morning ? "sunrise" : "golden-hour";
    return "day";
  }

  /* palette(date) -> { stops: [5 css colours], glow: 0..100 (% across), sun: css colour, phase, alt } */
  function palette(date, lat, lon) {
    var p = sun(date, lat, lon);
    var i = 0;
    while (i < K.length - 2 && p.alt > K[i + 1].a) i++;
    var a = K[i], b = K[i + 1];
    var t = Math.max(0, Math.min(1, (p.alt - a.a) / (b.a - a.a)));
    var top = mix(a.top, b.top, t), mid = mix(a.mid, b.mid, t), glow = mix(a.glow, b.glow, t), s = mix(a.sun, b.sun, t);
    /* the glow sits where the sun is: east on the left, west on the right */
    var x = (p.az - 60) / 240;
    x = Math.max(0.06, Math.min(0.94, x));
    if (p.alt < -12) x = p.az < 180 ? 0.06 : 0.94;
    var morning = p.az < 180;
    return {
      stops: [hex(top), hex(mid), hex(glow), hex(mid), hex(top)],
      glow: Math.round(x * 100), sun: hex(s), phase: phaseOf(p.alt, morning), alt: p.alt, az: p.az
    };
  }

  /* The next moment the sun's upper edge clears the horizon (-0.833 degrees). */
  function nextSunrise(date, lat, lon) {
    var t = date.getTime(), step = 120000, prev = sun(new Date(t), lat, lon).alt;
    for (var k = 1; k <= 1500; k++) {
      var cur = sun(new Date(t + k * step), lat, lon).alt;
      if (prev < -0.833 && cur >= -0.833) {
        /* refine to the minute */
        var lo = t + (k - 1) * step, hi = t + k * step;
        while (hi - lo > 30000) {
          var m = (lo + hi) / 2;
          if (sun(new Date(m), lat, lon).alt < -0.833) lo = m; else hi = m;
        }
        return new Date(hi);
      }
      prev = cur;
    }
    return null;
  }

  return { sun: sun, palette: palette, nextSunrise: nextSunrise, TORONTO: TORONTO };
});
