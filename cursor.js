// Purple pixel distortion cursor trail effect
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-canvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const maxParticles = 80;
  const mouse = { x: -100, y: -100 };

  // Purple color palette
  const purples = [
    'rgba(162, 89, 247, 0.9)',
    'rgba(127, 56, 199, 0.85)',
    'rgba(180, 120, 255, 0.8)',
    'rgba(138, 43, 226, 0.85)',
    'rgba(186, 85, 211, 0.8)',
    'rgba(148, 0, 211, 0.75)',
  ];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 4;
      this.speedX = (Math.random() - 0.5) * 3;
      this.speedY = (Math.random() - 0.5) * 3;
      this.color = purples[Math.floor(Math.random() * purples.length)];
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.15;
      // Distortion properties
      this.distortX = 0;
      this.distortY = 0;
      this.distortPhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
      this.rotation += this.rotationSpeed;
      this.size *= 0.98;
      
      // Add distortion wave effect
      this.distortPhase += 0.1;
      this.distortX = Math.sin(this.distortPhase) * 2;
      this.distortY = Math.cos(this.distortPhase) * 2;
      
      // Slow down
      this.speedX *= 0.98;
      this.speedY *= 0.98;
    }

    draw() {
      if (this.life <= 0) return;
      
      ctx.save();
      ctx.translate(this.x + this.distortX, this.y + this.distortY);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;
      
      // Draw pixelated square with distortion
      const halfSize = this.size / 2;
      ctx.fillRect(-halfSize, -halfSize, this.size, this.size);
      
      // Add glow effect
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 15;
      ctx.fillRect(-halfSize * 0.7, -halfSize * 0.7, this.size * 0.7, this.size * 0.7);
      
      ctx.restore();
    }

    isDead() {
      return this.life <= 0 || this.size < 0.5;
    }
  }

  function createParticles(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      if (particles.length < maxParticles) {
        particles.push(new Particle(x, y));
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      
      if (particles[i].isDead()) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  // Mouse move handler with throttling
  let lastTime = 0;
  const throttleMs = 16; // ~60fps

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTime >= throttleMs) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      createParticles(mouse.x, mouse.y, 2);
      lastTime = now;
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Start animation
  animate();
})();
