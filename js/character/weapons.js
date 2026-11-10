(function (G) {
  G.WEAPONS = [
    { id: "punch", name: "Punch", dmg: 12, color: "#ffcc44", anim: "punch" },
    { id: "sword", name: "Sword", dmg: 18, color: "#dfe6e9", anim: "slash" },
    { id: "axe", name: "Axe", dmg: 24, color: "#8d6e63", anim: "chop" },
    { id: "spear", name: "Spear", dmg: 16, color: "#bdc3c7", anim: "thrust" },
    { id: "bow", name: "Bow", dmg: 14, color: "#00b894", anim: "draw" },
    { id: "staff", name: "Staff", dmg: 15, color: "#a29bfe", anim: "cast" },
    { id: "hammer", name: "Hammer", dmg: 26, color: "#636e72", anim: "slam" },
    { id: "dagger", name: "Dagger", dmg: 13, color: "#2d3436", anim: "stab" },
    { id: "whip", name: "Whip", dmg: 11, color: "#e17055", anim: "whip" },
    { id: "gun", name: "Gun", dmg: 20, color: "#fdcb6e", anim: "shoot" },
    { id: "claw", name: "Claw", dmg: 17, color: "#e74c3c", anim: "swipe" },
    { id: "wand", name: "Wand", dmg: 14, color: "#74b9ff", anim: "spark" }
  ];

  G.weaponIndex = 0;

  G.currentWeapon = function () {
    return G.WEAPONS[G.weaponIndex] || G.WEAPONS[0];
  };

  G.cycleWeapon = function (dir) {
    G.weaponIndex = (G.weaponIndex + dir + G.WEAPONS.length) % G.WEAPONS.length;
  };

  // Apply the current weapon's attack pose
  G.weaponPose = function (r, p) {
    const w = G.currentWeapon();
    const a = 1 - (p.attack / 18);
    const f = p.facing || 1;
    const set = function (bone, ang) { if (bone) bone.ang = ang; };

    if (w.anim === "punch") {
      set(r.rArm, -20 - 100 * a);
      set(r.rFore, -40 * a);
    } else if (w.anim === "slash") {
      set(r.rArm, -30 - 120 * a);
      set(r.rFore, -20 + 40 * a);
      set(r.torso, -90 + 15 * a * f);
    } else if (w.anim === "chop") {
      set(r.rArm, -80 + 140 * a);
      set(r.rFore, 20);
      set(r.torso, -90 + 10 * a);
    } else if (w.anim === "thrust") {
      set(r.rArm, -10 - 30 * a);
      set(r.rFore, -5);
      set(r.lArm, 30);
    } else if (w.anim === "draw") {
      set(r.lArm, -40);
      set(r.rArm, -50 - 20 * a);
      set(r.rFore, -30);
    } else if (w.anim === "cast") {
      set(r.rArm, -60 - 30 * a);
      set(r.rFore, -10);
      set(r.head, -10 * a);
    } else if (w.anim === "slam") {
      set(r.rArm, -100 + 160 * a);
      set(r.rFore, 30);
      set(r.torso, -90 + 20 * a);
    } else if (w.anim === "stab") {
      set(r.rArm, -15 - 40 * a);
      set(r.rFore, -10);
    } else if (w.anim === "whip") {
      set(r.rArm, -20 - 80 * Math.sin(a * Math.PI));
      set(r.rFore, -60 * a);
    } else if (w.anim === "shoot") {
      set(r.rArm, -30);
      set(r.rFore, 0);
      set(r.lArm, -20);
    } else if (w.anim === "swipe") {
      set(r.rArm, -40 - 90 * a);
      set(r.lArm, 20 + 60 * a);
    } else if (w.anim === "spark") {
      set(r.rArm, -50 - 20 * Math.sin(a * Math.PI * 2));
      set(r.rFore, -15);
    }
  };

  G.addDraw("fx", function (ctx) {
    if (G.state !== "play" || !G.player) return;
    const w = G.currentWeapon();
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(8, G.PLAY_H - 28, 160, 20);
    ctx.fillStyle = w.color;
    ctx.font = "14px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(w.name + "  [Q/E]", 14, G.PLAY_H - 13);
  });
})(G);
