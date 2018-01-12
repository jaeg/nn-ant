var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");

var engine = {
  ants: [],
  init: function() {
    for (var i = 0; i < 100; i++) {
      this.ants.push({x:Math.floor(Math.random()*640), y: Math.floor(Math.random()*480)})
    }
  },
  update: function() {
    for (var i = 0; i < this.ants.length; i++) {
      this.ants[i].x += Math.floor(Math.random() * 3) - 1
      this.ants[i].y += Math.floor(Math.random() * 3) - 1
    }
    console.log('update')
  },
  draw: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < this.ants.length; i++) {
      ctx.fillRect(this.ants[i].x,this.ants[i].y,1,1);
    }
  }
}

function step() {
  engine.update();
  engine.draw();
  
  window.requestAnimationFrame(step);
}

engine.init()
window.requestAnimationFrame(step);