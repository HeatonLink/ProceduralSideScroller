(function (G) {
  G.pauseIndex = 0;
  G.PAUSE = [
    { id: "resume", label: "Resume" },
    { id: "inventory", label: "Inventory" },
    { id: "map", label: "Map" },
    { id: "options", label: "Options" },
    { id: "quit", label: "Quit to Menu" }
  ];

  G.pauseButtons = function () {
    const bw = 280, bh = 44, gap = 12, startY = 220;
    return G.PAUSE.map((item, i) => ({
      ...item,
      x: (G.W - bw) / 2,
      y: startY + i * (bh + gap),
      w: bw,
      h: bh
    }));
  };

  G.drawPause = function (ctx) {
    if (G.subState === "inventory" && G.drawInventory) {
      G.drawInventory(ctx);
      return;
    }
    if (G.subState === "map" && G.drawMap) {
      G.drawMap(ctx);
      return;
    }
    if ((G.subState === "options" || G.subState === "binds" || G.subState === "display") && G.drawOptions) {
      G.drawOptions(ctx);
      return;
    }
    ctx.fillStyle = "rgba(8,12,24,0.65)";
    ctx.fillRect(0, 0, G.W, G.H);
    ctx.textAlign = "center";
    ctx.fillStyle = "#f4f7ff";
    ctx.font = "bold 42px system-ui, sans-serif";
    ctx.fillText("PAUSED", G.W / 2, 160);

    G.pauseButtons().forEach((b, i) => {
      const on = i === G.pauseIndex;
      ctx.fillStyle = on ? "#4a90d9" : "rgba(30,40,60,0.9)";
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, b.w, b.h, 8);
      ctx.fill();
      if (on) {
        ctx.strokeStyle = "#ffe2a8";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.fillStyle = on ? "#fff" : "#ddd";
      ctx.font = "20px system-ui, sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2);
    });
    ctx.textBaseline = "alphabetic";
  };

  G.confirmPause = function () {
    const id = G.PAUSE[G.pauseIndex].id;
    if (id === "resume") G.state = "play";
    else if (id === "inventory") G.subState = "inventory";
    else if (id === "map") G.subState = "map";
    else if (id === "options") {
      G.subState = "options";
      G.optIndex = 0;
    }
    else if (id === "quit") {
      G.saveRun();
      G.state = "menu";
      document.getElementById("hud").classList.add("hidden");
    }
  };
})(G);
