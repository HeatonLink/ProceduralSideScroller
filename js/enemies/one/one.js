(function (G) {
  G.addEnemy({
    x: 700, y: 400, vx: 1.2, w: 32, h: 64, hp: 40,
    dir: 1, range: 120, home: 700, anim: 0,
    rig: G.makeRig("enemy", 0.85), state: "walk"
  });
})(G);
