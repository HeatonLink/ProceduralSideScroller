(function (G) {
  const canvas = document.getElementById("game");
  canvas.width = G.W;
  canvas.height = G.H;
  G.canvas = canvas;
  G.ctx = canvas.getContext("2d");

  document.getElementById("start").onclick = G.startGame;
  document.getElementById("retry").onclick = G.startGame;

  G.loop();
})(G);
