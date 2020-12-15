let system;

let pageWidth;
let pagetHeight;

let sprite;

function updatePageSize() {
  let body = document.body,
    html = document.documentElement;

  pageWidth = windowWidth

  pageHeight = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);
}

function setup() {
  updatePageSize();
  let canvas = createCanvas(pageWidth, pageHeight, WEBGL);
  canvas.parent("background");
  system = new ParticleSystem(createVector(width / 2, 50));
  sprite = loadImage("assets/coronaSprite.png");
}

function draw() {
  background(230, 250, 255);
  system.origin.x = 15 + mouseX - width/2;
  system.origin.y = 15 + mouseY - height/2;
  if(frameCount % 4 == 0) // ogni 4 frame
    system.addParticle();
  system.run();
}

function windowResized() {
  updatePageSize();
  resizeCanvas(pageWidth, pageHeight);
}

// A simple Particle class
let Particle = function (position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 255;
  this.size = random(10, 30);
  this.angle = random(0, 2* PI);
  this.angularSpeed = random(0, 0.05);
  this.direction = random(1) > 0.5? 1 : -1;
};

Particle.prototype.run = function () {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function () {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.angle += this.direction * this.angularSpeed;
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function () {
  imageMode(CENTER);
  tint(200, 100, 0, this.lifespan);
  push();
  translate(this.position.x, this.position.y);
  rotate(this.angle);
  image(sprite, 0, 0, this.size, this.size);
  pop();
};

// Is the particle still useful?
Particle.prototype.isDead = function () {
  return this.lifespan < 0;
};

let ParticleSystem = function (position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function () {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function () {
  for (let i = this.particles.length - 1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};