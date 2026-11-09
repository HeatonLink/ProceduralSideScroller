(function (G) {
  G.particles = [];
  G.addParticle = function (x, y, vx, vy, life, color, size) {
    G.particles.push({ x, y, vx, vy, life, max: life, color, size });
  };
  G.updateParticles = function () {
    for (let i = G.particles.length - 1; i >= 0; i--) {
      const p = G.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life--;
      if (p.life <= 0) G.particles.splice(i, 1);
    }
  };
  G.drawParticles = function (ctx) {
    for (const p of G.particles) {
      ctx.globalAlpha = p.life / p.max;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
})(G);
