(function (G) {
  G.drawInventory = function (ctx) {
    ctx.fillStyle = "rgba(8,12,24,0.85)";
    ctx.fillRect(0, 0, G.W, G.H);
    ctx.fillStyle = "#f4f7ff";
    ctx.font = "bold 32px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("INVENTORY", G.W / 2, 60);

    const items = Object.keys(G.inventory || {});
    if (!items.length) {
      ctx.font = "18px system-ui, sans-serif";
      ctx.fillStyle = "#aaa";
      ctx.fillText("No items yet", G.W / 2, 200);
    } else {
      items.forEach((id, i) => {
        const def = (G.POWERUP_TYPES || {})[id] || { name: id, color: "#fff" };
        const y = 120 + i * 50;
        ctx.fillStyle = def.color;
        ctx.beginPath();
        ctx.arc(120, y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "20px system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(def.name + "  x" + G.inventory[id], 150, y + 6);
      });
    }
    ctx.textAlign = "center";
    ctx.fillStyle = "#ddd";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("Coins collected: " + (G.score || 0), G.W / 2, G.H - 80);
    ctx.fillText("Press Escape to return", G.W / 2, G.H - 40);
  };
})(G);
