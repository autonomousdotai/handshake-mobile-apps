window.requestAnimFrame = (function(){
return window.requestAnimationFrame     ||
       window.webkitRequestAnimationFrame ||
       window.mozRequestAnimationFrame ||
       window.oRequestAnimationFrame ||
       window.msRequestAnimationFrame ||
function (callback) { 
       window.setTimeout(callback, 1000 / 60); 
};
})();

window.addEventListener('load',function(){
    var c = document.getElementById('canv');
    var $ = c.getContext('2d');
    var w = c.width = window.innerWidth;
    var h = c.height =  window.innerHeight;
    var mid_x = Math.floor(w/2);
    var mid_y = Math.floor(h/2);
    var ŭ = 0;
    var r = new Array;
    var s = 0;
 
    $.fillStyle = 'hsla(0,0%,0%,.7)';
  
(function draw() {
      ŭ -=.5;
      $.globalAlpha = 0.1;
      $.fillRect(0,0,w,h);
      $.globalAlpha = 1.0;
      $.strokeStyle = "hsla(" + (ŭ % 360) + ",100%,50%,1)";
      $.beginPath();
      r[0] = Math.sin(s)*250+120;
      r[1] = Math.cos(s)*125+60;
 	for(var i=0;i<16;i++) {
	    var rad = 22.5 * i * (Math.PI / 180) + s;
	    var x = Math.sin(rad) * r[i%2] + mid_x;
	    var y = Math.cos(rad) * r[i%2] + mid_y;
	    if (i === 0) 
      $.moveTo(x,y);
      $.lineWidth = 1.8;
	    $.lineTo(x,y);
	}
	$.closePath();
	$.stroke();
	s += 0.045; 
  s = s % 360;
   setTimeout(draw, 50);
})();   
},false);
window.requestAnimFrame(draw);