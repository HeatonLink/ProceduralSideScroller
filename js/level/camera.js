(function (G) {
  G.camX = 0;
  G.updateCamera = function (px) {
    const target = px - G.W * 0.4;
    G.camX += (target - G.camX) * 0.08;
    G.camX = Math.max(0, Math.min(G.camX, 2800));
  };
})(G);
