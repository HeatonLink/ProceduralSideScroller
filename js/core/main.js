(function (G) {
  const canvas = document.getElementById("game");
  canvas.width = G.W;
  canvas.height = G.H;
  G.canvas = canvas;
  G.ctx = canvas.getContext("2d");

  document.getElementById("retry").onclick = G.startGame;

  function canvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (G.W / rect.width),
      y: (e.clientY - rect.top) * (G.H / rect.height)
    };
  }

  function hit(list, x, y) {
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return i;
    }
    return -1;
  }

  canvas.addEventListener("mousemove", e => {
    if (G.state !== "pause" || G.subState) return;
    const p = canvasPos(e);
    const i = hit(G.pauseButtons(), p.x, p.y);
    if (i >= 0) G.pauseIndex = i;
  });

  canvas.addEventListener("click", e => {
    const p = canvasPos(e);
    if (G.state === "menu" && !G.subState) {
      const i = hit(G.menuButtons(), p.x, p.y);
      if (i >= 0) {
        G.menuIndex = i;
        G.confirmMenu();
      }
      return;
    }
    if (G.state !== "pause") return;
    if (G.subState === "inventory" || G.subState === "map") {
      G.subState = null;
      return;
    }
    if (G.subState) return;
    const i = hit(G.pauseButtons(), p.x, p.y);
    if (i >= 0) {
      G.pauseIndex = i;
      G.confirmPause();
    }
  });

  document.body.addEventListener("click", e => {
    if (e.target === canvas) return;
    if (G.state === "play") {
      G.state = "pause";
      G.pauseIndex = 0;
    }
  });

  G.loop();
})(G);
