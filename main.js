var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");

var engine = {
  ants: [],
  init: function() {
    for (var i = 0; i < 100; i++) {
      this.ants.push(new Ant(Math.floor(Math.random()*640),Math.floor(Math.random()*480)))
    }
  },
  update: function() {
    for (var i = 0; i < this.ants.length; i++) {
      this.ants[i].update()
    }
  },
  draw: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < this.ants.length; i++) {
      this.ants[i].draw()
    }
  }
}

class Ant {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  update() {
    this.x += Math.floor(Math.random() * 3) - 1
    this.y += Math.floor(Math.random() * 3) - 1
  }
  
  draw() {
    ctx.fillRect(this.x,this.y,1,1);
  }
}

function step() {
  engine.update();
  engine.draw();
  
  window.requestAnimationFrame(step);
}

engine.init()
window.requestAnimationFrame(step);