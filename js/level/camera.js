(function (G) {
  G.camX = 0;
  G.updateCamera = function (px) {
    const target = px - G.W * 0.4;
    G.camX += (target - G.camX) * 0.08;
    const max = Math.max(0, (G.stageW || G.STAGE_W) - G.W);
    G.camX = Math.max(0, Math.min(G.camX, max));
  };
})(G);
