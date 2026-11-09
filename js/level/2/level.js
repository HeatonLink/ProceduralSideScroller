(function (G) {
  // Drop a new folder js/level/3/level.js and call G.addLevel to add another stage.
  G.addLevel({
    id: "2",
    w: 1000,
    h: 1000,
    platforms: [
      { x: 0, y: 900, w: 1000, h: 100 },
      { x: 80, y: 740, w: 200, h: 24 },
      { x: 400, y: 640, w: 160, h: 24 },
      { x: 680, y: 760, w: 220, h: 24 }
    ],
    coins: [
      { x: 180, y: 700 },
      { x: 480, y: 600 },
      { x: 790, y: 720 }
    ]
  });
})(G);
