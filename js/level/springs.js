(function (G) {
  G.SPRING_POWER = -22; // much higher than normal jump (-14)
  G.springs = [];

  G.addSpring = function (x, y, w) {
    G.springs.push({ x, y, w: w || 40, h: 16, anim: 0 });
  };

  G.checkSprings = function (p) {
    if (!p) return;
    for (const s of G.springs) {
      const feet = { x: p.x + 4, y: p.y + p.h - 4, w: p.w - 8, h: 10 };
      const box = { x: s.x, y: s.y, w: s.w, h: s.h + 6 };
      const hit = feet.x < box.x + box.w && feet.x + feet.w > box.x &&
                  feet.y < box.y + box.h && feet.y + feet.h > box.y;
      if (hit && p.vy >= 0) {
        p.vy = G.SPRING_POWER;
        p.grounded = false;
        p.coyote = 0;
        p.buffer = 0;
        s.anim = 8;
        for (let i = 0; i < 10; i++) {
          G.addParticle(s.x + s.w / 2, s.y, (Math.random() - 0.5) * 6, -4, 25, "#ffeb3b", 3);
        }
      }
      if (s.anim > 0) s.anim--;
    }
  };

  G.addDraw("world", function (ctx) {
    ctx.save();
    ctx.translate(-G.camX, 0);
    for (const s of G.springs) {
      const squish = s.anim > 0 ? 4 : 0;
      // Base
      ctx.fillStyle = "#795548";
      ctx.fillRect(s.x, s.y + s.h - 4 + squish, s.w, 4);
      // Coil
      ctx.strokeStyle = "#ffeb3b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      const coils = 4;
      for (let i = 0; i <= coils; i++) {
        const t = i / coils;
        const yy = s.y + squish + t * (s.h - 6);
        const xx = s.x + (i % 2 === 0 ? 4 : s.w - 4);
        if (i === 0) ctx.moveTo(xx, yy);
        else ctx.lineTo(xx, yy);
      }
      ctx.stroke();
      // Top pad
      ctx.fillStyle = s.anim > 0 ? "#fff59d" : "#fdd835";
      ctx.fillRect(s.x - 2, s.y + squish, s.w + 4, 6);
    }
    ctx.restore();
  });

  G.addUpdate(function () {
    if (G.state === "play" && G.player) G.checkSprings(G.player);
  });
})(G);
