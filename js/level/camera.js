(function (G) {
  G.camX = 0;
  G.camY = 0;

  G.updateCamera = function (px, py) {
    const tx = px - G.W * 0.4;
    const ty = (py || 0) - G.PLAY_H * 0.55;
    G.camX += (tx - G.camX) * 0.08;
    G.camY += (ty - G.camY) * 0.08;
    const maxX = Math.max(0, (G.stageW || G.STAGE_W) - G.W);
    const maxY = Math.max(0, (G.stageH || G.STAGE_H) - G.PLAY_H);
    G.camX = Math.max(0, Math.min(G.camX, maxX));
    G.camY = Math.max(0, Math.min(G.camY, maxY));
  };
})(G);
