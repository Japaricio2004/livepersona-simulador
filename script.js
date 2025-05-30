const simulator = document.getElementById('simulator');
const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = simulator.clientWidth;
  canvas.height = simulator.clientHeight;
}
resizeCanvas();

const persons = [];

class Persona {
  constructor(intro, empathy, impulse) {
    this.intro = intro;
    this.empathy = empathy;
    this.impulse = impulse;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.color = `hsl(${this.empathy + this.impulse}, 70%, 60%)`;
    this.vx = (Math.random() - 0.5) * (1 + this.impulse / 20);
    this.vy = (Math.random() - 0.5) * (1 + this.impulse / 20);
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  interactWith(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 50) {
      if (this.empathy > 50 && other.empathy > 50) {
        // Empáticos: cambian de color a uno común
        const avgHue = ((this.empathy + other.empathy) / 2 + (this.impulse + other.impulse) / 2) % 360;
        this.color = other.color = `hsl(${avgHue}, 70%, 65%)`;
      } else if (this.intro > 60) {
        // Introvertido: se aleja
        this.vx *= -1;
        this.vy *= -1;
      }
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.restore();
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < persons.length; i++) {
    const p = persons[i];
    p.move();
    for (let j = i + 1; j < persons.length; j++) {
      p.interactWith(persons[j]);
    }
    p.draw();
  }
  requestAnimationFrame(animate);
}
animate();

document.getElementById('createBtn').addEventListener('click', () => {
  const intro = parseInt(document.getElementById('intro').value);
  const empathy = parseInt(document.getElementById('empathy').value);
  const impulse = parseInt(document.getElementById('impulse').value);
  const newPersona = new Persona(intro, empathy, impulse);
  persons.push(newPersona);
});

window.addEventListener('resize', () => {
  resizeCanvas();
});
