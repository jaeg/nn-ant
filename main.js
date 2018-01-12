var canvas = document.getElementById("main");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var ctx = canvas.getContext("2d");

var width = 640;
var height = 480;
var tileSize = 8;

var engine = {
  ants: [],
  pheromones: [],
  world: [],
  currentDepth: 0,
  init: function() {
    for (var depth = 0; depth < 20; depth++) {
      this.world[depth] = []
      for (var x = 0; x < width/tileSize; x++) {
        this.world[depth][x] = [];

        for (var y = 0; y < height/tileSize; y++) {
          if (depth === 0) {
            this.world[depth][x][y] = 0;
            if (Math.random() * 50 <= 10) {
              this.world[depth][x][y] = 1;
            }
          } else {
            this.world[depth][x][y] = 0;
            if (Math.random() * 50 <= 49) {
              this.world[depth][x][y] = 1;
            }
          }

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

    for (var i = 0; i < this.pheromones.length; i++) {
      if (this.pheromones[i].currentStrength <= 0) {
        this.pheromones.splice(i,1);
        i--;
        continue;
      }
      this.pheromones[i].update()
    }
  },
  draw: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < this.world[this.currentDepth].length; x++) {
      for (var y = 0; y < this.world[this.currentDepth][x].length; y++) {
        //draw the current layer
        if (this.world[this.currentDepth][x][y] === 1) {
          ctx.fillStyle = 'blue';
          ctx.fillRect(x * tileSize,y * tileSize,tileSize,tileSize);
        }
        //Draw layer below
        else if (this.world[this.currentDepth + 1] !== undefined) {
            if (this.world[this.currentDepth + 1][x][y] === 1) {
              ctx.fillStyle = 'darkblue';
              ctx.fillRect(x * tileSize,y * tileSize,tileSize,tileSize);
            } else {
              ctx.fillStyle = 'black';
              ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
        //Draw the void
        else {
          ctx.fillStyle = 'black';
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    }

    for (var i = 0; i < this.pheromones.length; i++) {
      this.pheromones[i].draw()
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

function getWorldBlock(world, x, y, depth) {
  var gridX = Math.floor(x / tileSize);
  var gridY = Math.floor(y / tileSize);

  if (gridX < 0 || gridY < 0 || gridX >= world[depth].length || gridY >= world[depth][gridX].length) return -1;
  return world[depth][gridX][gridY];
}

function up() {
  if (engine.currentDepth > 0)
    engine.currentDepth--;
}

function down() {
  if (engine.currentDepth < engine.world.length - 1)
    engine.currentDepth++;
}

class Pheromone {
  constructor(x,y, strength, depth) {
    this.x = x;
    this.y = y;
    this.startingStrength = strength;
    this.currentStrength = strength;
    this.depth = depth;
  }
  update() {
    this.currentStrength -= .01;
  }
  draw() {
    if (this.depth !== engine.currentDepth) return;
    ctx.fillStyle = 'rgba(255,255,0, ' + this.currentStrength / this.startingStrength + ')';
    ctx.fillRect(this.x,this.y,2,2);
  }

}

class Ant {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.depth = 0;
    this.bodyColor = 'black';
    this.headColor = 'orange';
    this.antennaLeftContact = false;
    this.antennaRightContact = false;
    this.rotation = Math.floor(Math.random() * 360);
    this.antennaAngle = 20;
    this.bumpCounter = 0;
    this.bumpRotation = 0;
  }
  update(world) {
    if (this.depth < world.length - 2) {
      var block = getWorldBlock(world,this.x,this.y,this.depth+1)
      if (block === 0) {
          this.depth++;
      }
    }
    this.antennaLeftContact = this.checkLeftAntenna(world);
    this.antennaRightContact = this.checkRightAntenna(world);

    if (!this.bumpCounter) {
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
    }


    if (this.bumpCounter > 0) {
      this.bumpCounter--;
      this.rotation += this.bumpRotation;
    } else {
      this.moveForward(1);
      this.dropPheromone();
    }
  }

  draw() {
    if (this.depth !== engine.currentDepth) return;
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
    var velX = speed * Math.cos(this.rotation * Math.PI / 180);
    var velY = speed * Math.sin(this.rotation * Math.PI / 180);

    var newX = this.x + velX;
    var newY = this.y + velY;

    if (getWorldBlock(engine.world, newX, this.y,this.depth) === 1) {
      newX -= velX
    }

    if (getWorldBlock(engine.world, this.x, newY, this.depth) === 1) {
      newY -= velY
    }

    if (newY < height && newY > 0) {
      this.y = newY;
    }

    if (newX < width && newX > 0) {
      this.x = newX;
    }
  }

  moveBackward(speed) {
    var velX = speed * Math.cos(this.rotation * Math.PI / 180);
    var velY = speed * Math.sin(this.rotation * Math.PI / 180);

    var newX = this.x - velX;
    var newY = this.y - velY;

    if (getWorldBlock(engine.world, newX, this.y,this.depth) === 1) {
      newX += velX
    }

    if (getWorldBlock(engine.world, this.x, newY, this.depth) === 1) {
      newY += velY
    }

    if (newY <= height && newY >= 0) {
      this.y = newY;
    }

    if (newX <= width && newX >= 0) {
      this.x = newX;
    }
  }

  dropPheromone() {
    var pheromone = new Pheromone(this.x,this.y, 1, this.depth)
    engine.pheromones.push(pheromone)
  }
  checkLeftAntenna(world) {
    var antenX = this.x + 3 * Math.cos(wrapDir(this.rotation - this.antennaAngle ) * Math.PI / 180);
    var antenY = this.y + 3 * Math.sin(wrapDir(this.rotation - this.antennaAngle ) * Math.PI / 180);

    //The world's bounds is a contact (glass container)
    if (antenX >= width || antenX <= 0) return true;
    if (antenY >= height || antenY <= 0) return true;

    var block = getWorldBlock(world,antenX,antenY,this.depth)
    if (block === -1) return true;
    if (block === 1) return true;

    return false;
  }

  checkRightAntenna(world) {
    var antenX = this.x + 3 * Math.cos(wrapDir(this.rotation + this.antennaAngle ) * Math.PI / 180);
    var antenY = this.y + 3 * Math.sin(wrapDir(this.rotation + this.antennaAngle )* Math.PI / 180);

    //The world's bounds is a contact (glass container)
    if (antenX >= width || antenX <= 0) return true;
    if (antenY >= height || antenY <= 0) return true;

    var block = getWorldBlock(world,antenX,antenY,this.depth)
    if (block === -1) return true;
    if (block === 1) return true;

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
