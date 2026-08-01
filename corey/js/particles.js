(function() {
  const hero = document.querySelector('.cy-hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'heroCanvas';
  hero.prepend(canvas);

  // CSS for canvas
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';

  // Ensure content sits above canvas
  const wrap = hero.querySelector('.wrap');
  if(wrap) {
    wrap.style.position = 'relative';
    wrap.style.zIndex = '1';
  }

  const ctx = canvas.getContext('2d');
  let w, h;

  const mouse = { x: null, y: null };
  hero.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 50 + 20;
      this.baseX = this.x;
      this.baseY = this.y;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Wrap around edges for infinite flow
      if (this.x < 0) this.x = w;
      if (this.x > w) this.x = 0;
      if (this.y < 0) this.y = h;
      if (this.y > h) this.y = 0;
      
      // Swirl towards mouse like a school of fish
      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 250) {
          // Fish-like avoidance/attraction
          this.vx += dx * 0.00015;
          this.vy += dy * 0.00015;
        }
      }
      
      // Swirl motion
      this.vx += Math.sin(this.y * 0.01) * 0.01;
      this.vy += Math.cos(this.x * 0.01) * 0.01;
      
      // Speed limit
      const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
      if(speed > 0.8) {
        this.vx = (this.vx / speed) * 0.8;
        this.vy = (this.vy / speed) * 0.8;
      }
    }
    draw() {
      const gradient = ctx.createRadialGradient(
        this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.1,
        this.x, this.y, this.radius
      );
      gradient.addColorStop(0, 'rgba(234, 227, 216, 0.6)');
      gradient.addColorStop(1, 'rgba(234, 227, 216, 0.0)');
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  // Adjust particle count for large marbles
  const particleCount = Math.min(30, Math.floor((w * h) / 40000));
  const particles = [];
  for(let i=0; i<particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    
    for(let i=0; i<particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      // Lines removed for large marble effect
    }
    requestAnimationFrame(animate);
  }
  animate();
})();
