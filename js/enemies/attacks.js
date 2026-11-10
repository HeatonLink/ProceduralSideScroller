(function (G) {
  G.ATTACK_TYPES = {
    fire:     { name: "Fire",     dmg: 1.2, color: "#e17055", effect: "burn" },
    water:    { name: "Water",    dmg: 1.0, color: "#0984e3", effect: "slow" },
    ice:      { name: "Ice",      dmg: 1.1, color: "#74b9ff", effect: "freeze" },
    blunt:    { name: "Blunt",    dmg: 1.3, color: "#636e72", effect: "stun" },
    slashing: { name: "Slashing", dmg: 1.4, color: "#dfe6e9", effect: "bleed" },
    electric: { name: "Electric", dmg: 1.1, color: "#f1c40f", effect: "shock" },
    poison:   { name: "Poison",   dmg: 0.8, color: "#00b894", effect: "poison" },
    pierce:   { name: "Pierce",   dmg: 1.5, color: "#bdc3c7", effect: "none" },
    magic:    { name: "Magic",    dmg: 1.2, color: "#a29bfe", effect: "none" },
    earth:    { name: "Earth",    dmg: 1.1, color: "#8d6e63", effect: "slow" }
  };

  G.attackFor = function (e) {
    if (e.attack) return e.attack;
    const id = (e.id || e.name || "").toLowerCase();
    if (id.includes("fire") || id.includes("dragon") || id.includes("phoenix")) return "fire";
    if (id.includes("ice")) return "ice";
    if (id.includes("water") || id.includes("fish") || id.includes("frog")) return "water";
    if (id.includes("electric")) return "electric";
    if (id.includes("poison") || id.includes("snake") || id.includes("toad") || id.includes("spore")) return "poison";
    if (id.includes("knight") || id.includes("rogue") || id.includes("slashing")) return "slashing";
    if (id.includes("mage") || id.includes("necromancer") || id.includes("ghost")) return "magic";
    if (id.includes("archer") || id.includes("sniper") || id.includes("bee") || id.includes("wasp")) return "pierce";
    if (id.includes("bear") || id.includes("giant") || id.includes("charger") || id.includes("blunt")) return "blunt";
    if (id.includes("crab") || id.includes("beetle") || id.includes("armored")) return "earth";
    return "blunt";
  };

  G.status = G.status || { burn: 0, freeze: 0, poison: 0, slow: 0, stun: 0, bleed: 0, shock: 0 };

  G.applyAttack = function (e, target) {
    const type = G.attackFor(e);
    const def = G.ATTACK_TYPES[type] || G.ATTACK_TYPES.blunt;
    if (target) target.lastHit = type;
    const base = (e.dmg || 8) * def.dmg;
    if (target && !(G.flags && G.flags.shield > 0)) {
      target.hp -= base * 0.08;
    }
    if (def.effect && def.effect !== "none") {
      G.status[def.effect] = Math.max(G.status[def.effect] || 0, 90);
    }
    if (G.addParticle && target) {
      for (let i = 0; i < 6; i++) {
        G.addParticle(target.x + 6, target.y + 10, (Math.random()-0.5)*4, -2, 20, def.color, 3);
      }
    }
    return def;
  };

  G.tickStatus = function (p) {
    if (!p) return;
    if (G.status.burn > 0) { G.status.burn--; if (G.status.burn % 20 === 0) p.hp -= 1; }
    if (G.status.poison > 0) { G.status.poison--; if (G.status.poison % 30 === 0) p.hp -= 1; }
    if (G.status.bleed > 0) { G.status.bleed--; if (G.status.bleed % 15 === 0) p.hp -= 1; }
    if (G.status.freeze > 0) G.status.freeze--;
    if (G.status.slow > 0) G.status.slow--;
    if (G.status.stun > 0) G.status.stun--;
    if (G.status.shock > 0) G.status.shock--;
    if (G.status.freeze > 0 || G.status.stun > 0) p.vx *= 0.1;
    else if (G.status.slow > 0) p.vx *= 0.6;
  };

  G.addUpdate(function () {
    if (G.state === "play" && G.player) G.tickStatus(G.player);
  });
})(G);
