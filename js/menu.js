(function (G) {
  G.MENU = [
    { id: "play", label: "Play" },
    { id: "character", label: "Character" },
    { id: "options", label: "Options" },
    { id: "achievements", label: "Achievements" },
    { id: "how", label: "How to Play" }
  ];
  G.menuIndex = 0;
  G.subState = null;

  G.menuButtons = function () {
    const bw = 280, bh = 44, gap = 10, startY = 280;
    return G.MENU.map((item, i) => ({
      ...item,
      x: (G.W - bw) / 2,
      y: startY + i * (bh + gap),
      w: bw,
      h: bh
    }));
  };

  G.drawMenu = function (ctx) {
    ctx.fillStyle = "rgba(8,12,24,0.75)";
    ctx.fillRect(0, 0, G.W, G.H);
    ctx.textAlign = "center";
    ctx.fillStyle = "#f4f7ff";
    ctx.font = "bold 56px system-ui, sans-serif";
    ctx.fillText("Procedural", G.W / 2, 120);
    ctx.font = "bold 36px system-ui, sans-serif";
    ctx.fillText("Side Scroller", G.W / 2, 170);

    G.menuButtons().forEach((b, i) => {
      const on = i === G.menuIndex;
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

  G.confirmMenu = function () {
    const id = G.MENU[G.menuIndex].id;
    if (id === "play") G.startGame();
    else G.subState = id;
  };

  G.handleMenuKey = function (code) {
    if (G.state !== "menu") return;
    if (G.subState) {
      if (code === "Escape" || code === "Backspace" || code === "Enter") G.subState = null;
      return;
    }
    if (code === "ArrowDown" || code === "KeyS") G.menuIndex = (G.menuIndex + 1) % G.MENU.length;
    if (code === "ArrowUp" || code === "KeyW") G.menuIndex = (G.menuIndex - 1 + G.MENU.length) % G.MENU.length;
    if (code === "Enter" || code === "Space") G.confirmMenu();
  };

  G.drawSub = function (ctx) {
    if (!G.subState) return;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, G.W, G.H);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 32px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(G.subState.toUpperCase(), G.W / 2, 280);
    ctx.font = "18px system-ui, sans-serif";
    ctx.fillText("Coming soon  ·  Esc to back", G.W / 2, 340);
  };
})(G);
