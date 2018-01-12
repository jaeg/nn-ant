var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");

var width = 640;
var height = 480;

var engine = {
  ants: [],
  init: function() {
    for (var i = 0; i < 100; i++) {
      this.ants.push(new Ant(Math.floor(Math.random()*width),Math.floor(Math.random()*height)))
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
    this.bodyColor = 'black';
    this.headColor = 'red';
    this.rotation = 0;
  }
  update() {
    //this.x += Math.floor(Math.random() * 3) - 1
    //this.y += Math.floor(Math.random() * 3) - 1
    this.rotation += Math.floor(Math.random() * 20) - 10;
    this.moveForward(1);
  }
  
  draw() {
    ctx.fillStyle = this.bodyColor;
    ctx.fillRect(this.x,this.y,2,2);
    
    // head
    var headX = this.x + 1 * Math.cos(this.rotation * Math.PI / 180);
    var headY = this.y + 1 * Math.sin(this.rotation * Math.PI / 180);
    
    ctx.fillStyle = this.headColor;
    ctx.fillRect(headX, headY, 1, 1);
  }
  
  moveForward(speed) {
    var newX = this.x + speed * Math.cos(this.rotation * Math.PI / 180);
    var newY = this.y + speed * Math.sin(this.rotation * Math.PI / 180);
    
    if (newY < height && newY > 0) {
      this.y = newY;
    }
    
    if (newX < width && newX > 0) {
      this.x = newX;
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