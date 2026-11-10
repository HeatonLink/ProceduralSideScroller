(function (G) {
  // Death poses keyed by the attack type that killed the player.
  G.DEATH_POSES = {
    fire: function (r, t) {
      set(r.torso, -90 + 40);
      set(r.head, 30);
      set(r.lArm, 60); set(r.rArm, 60);
      set(r.lFore, 40); set(r.rFore, 40);
      set(r.lThigh, 110); set(r.rThigh, 70);
      if (r.tail) set(r.tail, 200);
    },
    water: function (r, t) {
      set(r.torso, -90 + Math.sin(t) * 15);
      set(r.head, 20);
      set(r.lArm, 30 + Math.sin(t) * 20);
      set(r.rArm, -30 + Math.sin(t) * 20);
      set(r.lThigh, 80); set(r.rThigh, 100);
    },
    ice: function (r, t) {
      set(r.torso, -90);
      set(r.head, 0);
      set(r.lArm, 15); set(r.rArm, -15);
      set(r.lFore, 5); set(r.rFore, -5);
      set(r.lThigh, 90); set(r.rThigh, 90);
      set(r.lShin, 5); set(r.rShin, 5);
    },
    blunt: function (r, t) {
      set(r.torso, -90 + 70);
      set(r.head, 40);
      set(r.lArm, 100); set(r.rArm, -100);
      set(r.lThigh, 120); set(r.rThigh, 60);
    },
    slashing: function (r, t) {
      set(r.torso, -90 + 50);
      set(r.head, -30);
      set(r.lArm, 40); set(r.rArm, -80);
      set(r.lThigh, 100); set(r.rThigh, 80);
    },
    electric: function (r, t) {
      const j = Math.sin(t * 8) * 25;
      set(r.torso, -90 + j);
      set(r.head, j * 0.5);
      set(r.lArm, 40 + j); set(r.rArm, -40 - j);
      set(r.lThigh, 90 + j * 0.5); set(r.rThigh, 90 - j * 0.5);
    },
    poison: function (r, t) {
      set(r.torso, -90 + 30 + Math.sin(t * 2) * 5);
      set(r.head, 25);
      set(r.lArm, 50); set(r.rArm, 20);
      set(r.lThigh, 100); set(r.rThigh, 80);
    },
    pierce: function (r, t) {
      set(r.torso, -90 + 20);
      set(r.head, -10);
      set(r.lArm, 30); set(r.rArm, -60);
      set(r.lThigh, 95); set(r.rThigh, 85);
    },
    magic: function (r, t) {
      set(r.torso, -90 + Math.sin(t) * 10);
      set(r.head, -15);
      set(r.lArm, -40); set(r.rArm, -40);
      set(r.lThigh, 70); set(r.rThigh, 110);
    },
    earth: function (r, t) {
      set(r.torso, -90 + 80);
      set(r.head, 50);
      set(r.lArm, 90); set(r.rArm, 90);
      set(r.lThigh, 130); set(r.rThigh, 50);
    }
  };

  function set(bone, ang) { if (bone) bone.ang = ang; }

  G.playDeath = function (p, type) {
    if (!p || !p.rig) return;
    p.deathType = type || p.deathType || "blunt";
    p.deathAnim = (p.deathAnim || 0) + 1;
    const pose = G.DEATH_POSES[p.deathType] || G.DEATH_POSES.blunt;
    pose(p.rig, p.deathAnim * 0.1);
    G.pose(p.rig.root, p.x + p.w / 2, p.y + 6, 0);
  };

  G.addUpdate(function () {
    if (G.state === "dead" && G.player) G.playDeath(G.player);
  });
})(G);
