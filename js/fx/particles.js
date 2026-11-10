(function (G) {
  G.particles = [];
  G.addParticle = function (x, y, vx, vy, life, color, size) {
    G.particles.push({ x, y, vx, vy, life, max: life, color, size });
  };

  // speed is downward speed on impact. Bigger speed, bigger puff.
  G.spawnDust = function (x, y, speed, color) {
    const s = Math.max(0, speed || 0);
    const n = Math.min(28, 4 + Math.floor(s * 1.4));
    const spread = 1.2 + s * 0.25;
    const col = color || "#a1887f";
    for (let i = 0; i < n; i++) {
      const vx = (Math.random() - 0.5) * spread * 2;
      const vy = -Math.random() * (1 + s * 0.15);
      const size = 2 + Math.random() * (1 + s * 0.12);
      const life = 12 + Math.floor(Math.random() * 10 + s);
      G.addParticle(x + (Math.random() - 0.5) * 10, y, vx, vy, life, col, size);
    }
  };

  G.updateParticles = function () {
    for (let i = G.particles.length - 1; i >= 0; i--) {
      const p = G.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.life--;
      if (p.life <= 0) G.particles.splice(i, 1);
    }
  };

  G.addDraw("fx", function (ctx) {
    ctx.save();
    ctx.translate(-G.camX, -G.camY);
    for (const p of G.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  });
})(G);
