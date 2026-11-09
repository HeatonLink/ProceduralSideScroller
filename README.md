# Procedural Side Scroller

High-quality HTML5 canvas side-scroller using **procedural skeletal rigging** for all characters instead of pixel sprite sheets.

Open `index.html` in a browser.

## Controls
- A / D or Left / Right: move
- Space or Up: jump (coyote time + jump buffer)
- J: attack
- Esc: pause
- Menu / Pause: Up/Down or click, Enter to confirm

## Adding content (non-fragile)
New content registers itself. You do not edit the main loop or draw function.

| What | How |
|------|-----|
| Level | `G.addLevel({ id, platforms, coins })` in `js/level/<n>/level.js` |
| Enemy | `G.addEnemy({...})` in `js/enemies/<name>/<name>.js` |
| NPC | `G.addNpc({...})` in `js/npcs/<name>/<name>.js` |
| Boss | `G.addBoss({...})` in `js/bosses/<name>/<name>.js` |
| Update | `G.addUpdate(fn)` |
| Draw | `G.addDraw("layer", fn)` |

### Draw layers (order is fixed and explicit)
`bg` → `world` → `items` → `enemies` → `npcs` → `bosses` → `player` → `fx`

Add a new layer name to `G.LAYERS` in `js/registry.js` if you need one.

## Folder structure
- `js/registry.js` — registration + draw layers
- `js/character/` — player
- `js/characters/` — optional rig overrides
- `js/enemies/` — shared + per-enemy folders
- `js/npcs/` — per-NPC folders
- `js/bosses/` — per-boss folders
- `js/menu/` — main menu
- `js/pause/` — pause menu
- `js/level/1/` — level data

Inspired by [BonkySideScroller](https://github.com/HeatonLink/BonkySideScroller).
