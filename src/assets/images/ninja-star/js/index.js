window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
       window.webkitRequestAnimationFrame ||
       window.mozRequestAnimationFrame ||
       window.oRequestAnimationFrame ||
       window.msRequestAnimationFrame ||
function (callback) {
  window.setTimeout(callback, 1000 / 60);
};
}());

window.addEventListener('load', () => {
  const c = document.getElementById('canv');
  const $ = c.getContext('2d');
  const w = c.width = window.innerWidth;
  const h = c.height = window.innerHeight;
  const mid_x = Math.floor(w / 2);
  const mid_y = Math.floor(h / 2);
  let ŭ = 0;
  const r = new Array();
  let s = 0;

  $.fillStyle = 'hsla(0,0%,0%,.7)';

  (function draw() {
    ŭ -= 0.5;
    $.globalAlpha = 0.1;
    $.fillRect(0, 0, w, h);
    $.globalAlpha = 1.0;
    $.strokeStyle = `hsla(${ŭ % 360},100%,50%,1)`;
    $.beginPath();
    r[0] = Math.sin(s) * 250 + 120;
    r[1] = Math.cos(s) * 125 + 60;
 	for (let i = 0; i < 16; i++) {
	    const rad = 22.5 * i * (Math.PI / 180) + s;
	    const x = Math.sin(rad) * r[i % 2] + mid_x;
	    const y = Math.cos(rad) * r[i % 2] + mid_y;
	    if (i === 0) { $.moveTo(x, y); }
      $.lineWidth = 1.8;
	    $.lineTo(x, y);
    }
    $.closePath();
    $.stroke();
    s += 0.045;
    s %= 360;
    setTimeout(draw, 50);
  }());
}, false);
window.requestAnimFrame(draw);
