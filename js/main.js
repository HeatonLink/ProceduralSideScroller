(function (G) {
  const canvas = document.getElementById("game");
  canvas.width = G.W;
  canvas.height = G.H;
  G.canvas = canvas;
  G.ctx = canvas.getContext("2d");

  document.getElementById("retry").onclick = G.startGame;

  canvas.addEventListener("click", e => {
    if (G.state !== "menu" || G.subState) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (G.W / rect.width);
    const y = (e.clientY - rect.top) * (G.H / rect.height);
    const buttons = G.menuButtons();
    for (let i = 0; i < buttons.length; i++) {
      const b = buttons[i];
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        G.menuIndex = i;
        G.confirmMenu();
        return;
      }
    }
  });

  G.loop();
})(G);
