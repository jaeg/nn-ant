var canvas = document.getElementById("main");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var ctx = canvas.getContext("2d");

var width = 640;
var height = 480;
var tileSize = 16;

var engine = {
  ants: [],
  world: [],
  init: function() {
    for (var x = 0; x < width/tileSize; x++) {
      this.world[x] = [];
      for (var y = 0; y < height/tileSize; y++) {
        this.world[x][y] = 0;
        if (Math.random() * 50 <= 1) {
          this.world[x][y] = 1
        }
      }
    }
    
    for (var i = 0; i < 100; i++) {
      var gridX = Math.floor(Math.random()*width / tileSize);
      var gridY = Math.floor(Math.random()*height / tileSize);
      if (gridX < 0 || gridY < 0 || gridX >= this.world.length || gridY >= this.world[gridX].length) {
        i--;
        continue
      }
      if (this.world[gridX][gridY] === 1) {
        i--;
        continue
      }
      this.ants.push(new Ant(gridX * tileSize, gridY * tileSize))
    }
  },
  update: function() {
    for (var i = 0; i < this.ants.length; i++) {
      this.ants[i].update(this.world)
    }
  },
  draw: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < this.world.length; x++) {
      for (var y = 0; y < this.world[x].length; y++) {
        if (this.world[x][y] === 1) {
          ctx.fillStyle = 'blue';
          ctx.fillRect(x * tileSize,y * tileSize,tileSize,tileSize);
        }
      }
    }
    
    for (var i = 0; i < this.ants.length; i++) {
      this.ants[i].draw()
    }
    
  }
}

function wrapDir(dir) {
  if (dir > 360) {
    dir -= 360
  } 
  if (dir < 0) {
    dir += 360
  }
  
  return dir
}

class Ant {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.bodyColor = 'black';
    this.headColor = 'black';
    this.antennaLeftContact = false;
    this.antennaRightContact = false;
    this.rotation = Math.floor(Math.random() * 360);
    this.antennaAngle = 35;
    this.bumpCounter = 0;
    this.bumpRotation = 0;
  }
  update(world) {
    this.antennaLeftContact = this.checkLeftAntenna(world);
    this.antennaRightContact = this.checkRightAntenna(world);
    
    if (this.antennaLeftContact && this.antennaRightContact) {
      this.bumpCounter = 50;
      this.bumpRotation = (Math.floor(Math.random() * 3) - 1) * 2 || 2;
    }
    else if (this.antennaLeftContact) {
      this.bumpCounter = 10;
      this.bumpRotation = 10;
    }
    else if (this.antennaRightContact) {
      this.bumpCounter = 10;
      this.bumpRotation = -10;
    }
    
    if (this.bumpCounter > 0) {
      this.bumpCounter--;
      this.rotation += this.bumpRotation;
      this.moveBackward(1);
    }
    else {
      this.moveForward(1);
    }
    //Math.floor(Math.random() * 20) - 10;
  }
  
  draw() {
    ctx.fillStyle = this.bodyColor;
    ctx.fillRect(this.x,this.y,2,2);
    
    // head
    var headX = this.x + 1 * Math.cos(wrapDir(this.rotation) * Math.PI / 180);
    var headY = this.y + 1 * Math.sin(wrapDir(this.rotation)* Math.PI / 180);
    
    ctx.fillStyle = this.headColor;
    ctx.fillRect(headX, headY, 2, 2);
    
    //Right antenna
    var antenX = this.x + 3 * Math.cos(wrapDir(this.rotation + this.antennaAngle ) * Math.PI / 180);
    var antenY = this.y + 3 * Math.sin(wrapDir(this.rotation + this.antennaAngle  )* Math.PI / 180);
    
    ctx.fillStyle = 'green';
    if (this.antennaRightContact) {
      ctx.fillStyle = 'red';
    }
    ctx.fillRect(antenX, antenY, 1, 1);
    
    //Left antenna
    var antenX = this.x + 3 * Math.cos(wrapDir(this.rotation - this.antennaAngle ) * Math.PI / 180);
    var antenY = this.y + 3 * Math.sin(wrapDir(this.rotation - this.antennaAngle  )* Math.PI / 180);
    
    ctx.fillStyle = 'green';
    if (this.antennaLeftContact) {
      ctx.fillStyle = 'red';
    }
    ctx.fillRect(antenX, antenY, 1, 1);
  }
    
  moveForward(speed) {
    var newX = this.x + speed * Math.cos(this.rotation * Math.PI / 180);
    var newY = this.y + speed * Math.sin(this.rotation * Math.PI / 180);

    var gridX = Math.floor(newX / tileSize);
    var gridY = Math.floor(newY / tileSize);
    
    if (gridX < 0 || gridY < 0 || gridX >= engine.world.length || gridY >= engine.world[gridX].length) return;
    if (engine.world[gridX][gridY] === 1) {
      return;
    }
    
    if (newY < height && newY > 0) {
      this.y = newY;
    }
    
    if (newX < width && newX > 0) {
      this.x = newX;
    }
  }
  
  moveBackward(speed) {
    var newX = this.x - speed * Math.cos(this.rotation * Math.PI / 180);
    var newY = this.y - speed * Math.sin(this.rotation * Math.PI / 180);

    var gridX = Math.floor(newX / tileSize);
    var gridY = Math.floor(newY / tileSize);
    
    if (gridX < 0 || gridY < 0 || gridX >= engine.world.length || gridY >= engine.world[gridX].length) return;
    if (engine.world[gridX][gridY] === 1) {
      return;
    }
    
    if (newY <= height && newY >= 0) {
      this.y = newY;
    }
    
    if (newX <= width && newX >= 0) {
      this.x = newX;
    }
  }
  
  checkLeftAntenna(world) {
    var antenX = this.x + 3 * Math.cos(wrapDir(this.rotation - this.antennaAngle ) * Math.PI / 180);
    var antenY = this.y + 3 * Math.sin(wrapDir(this.rotation - this.antennaAngle ) * Math.PI / 180);

    //The world's bounds is a contact (glass container)
    if (antenX >= width || antenX <= 0) return true;
    if (antenY >= height || antenY <= 0) return true;
        
    var gridX = Math.floor(antenX / tileSize);
    var gridY = Math.floor(antenY / tileSize);
    if (gridX < 0 || gridY < 0 || gridX >= world.length || gridY >= world[gridX].length) return true;
    if (world[gridX][gridY] === 1) {
      return true;
    }
    return false;
  }
  
  checkRightAntenna(world) {
    var antenX = this.x + 3 * Math.cos(wrapDir(this.rotation + this.antennaAngle ) * Math.PI / 180);
    var antenY = this.y + 3 * Math.sin(wrapDir(this.rotation + this.antennaAngle )* Math.PI / 180);
    
    //The world's bounds is a contact (glass container)
    if (antenX >= width || antenX <= 0) return true;
    if (antenY >= height || antenY <= 0) return true;
    
    var gridX = Math.floor(antenX / tileSize);
    var gridY = Math.floor(antenY / tileSize);
    if (gridX < 0 || gridY < 0 || gridX >= world.length || gridY >= world[gridX].length) return true;
    if (world[gridX][gridY] === 1) {
      return true;
    }
    
    return false;
  }
}

function step() {
  engine.update();
  engine.draw();
  
  window.requestAnimationFrame(step);
}

engine.init()
window.requestAnimationFrame(step);