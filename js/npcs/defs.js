(function (G) {
  // A few dozen NPCs scattered across the grid.
  // Each has dialogue options that set flags and can move them to other cells.
  G.NPC_DEFS = [
    { id: "guide", name: "Guide", gx: 0, gy: 0, x: 200, text: "Welcome. Where should I go?", options: [
      { label: "Stay here", flag: "guide_stay", to: { gx: 0, gy: 0 } },
      { label: "Go east", flag: "guide_east", to: { gx: 1, gy: 0 } },
      { label: "Go north", flag: "guide_north", to: { gx: 0, gy: -1 } }
    ]},
    { id: "merchant", name: "Merchant", gx: 1, gy: 0, x: 300, text: "I sell wares. Where next?", options: [
      { label: "Set up shop here", flag: "merchant_here", to: { gx: 1, gy: 0 } },
      { label: "Move west", flag: "merchant_west", to: { gx: 0, gy: 0 } },
      { label: "Move south", flag: "merchant_south", to: { gx: 1, gy: 1 } }
    ]},
    { id: "scout", name: "Scout", gx: -1, gy: 0, x: 400, text: "I've mapped the area.", options: [
      { label: "Scout east", flag: "scout_east", to: { gx: 1, gy: 0 } },
      { label: "Scout north", flag: "scout_north", to: { gx: -1, gy: -1 } },
      { label: "Return home", flag: "scout_home", to: { gx: 0, gy: 0 } }
    ]},
    { id: "elder", name: "Elder", gx: 0, gy: 1, x: 250, text: "The old ways remain.", options: [
      { label: "Stay in the village", flag: "elder_stay", to: { gx: 0, gy: 1 } },
      { label: "Visit the ruins", flag: "elder_ruins", to: { gx: 2, gy: 2 } }
    ]},
    { id: "hunter", name: "Hunter", gx: 0, gy: -1, x: 350, text: "Game is scarce.", options: [
      { label: "Hunt east", flag: "hunter_east", to: { gx: 2, gy: -1 } },
      { label: "Hunt west", flag: "hunter_west", to: { gx: -2, gy: -1 } },
      { label: "Return", flag: "hunter_return", to: { gx: 0, gy: 0 } }
    ]},
    { id: "miner", name: "Miner", gx: 2, gy: 0, x: 180, text: "The cave calls.", options: [
      { label: "Dig here", flag: "miner_here", to: { gx: 2, gy: 0 } },
      { label: "Move deeper", flag: "miner_deep", to: { gx: 3, gy: 0 } },
      { label: "Go to the surface", flag: "miner_surface", to: { gx: 1, gy: 0 } }
    ]},
    { id: "fisher", name: "Fisher", gx: -2, gy: 0, x: 220, text: "The waters are calm.", options: [
      { label: "Fish here", flag: "fisher_here", to: { gx: -2, gy: 0 } },
      { label: "Try the south shore", flag: "fisher_south", to: { gx: -2, gy: 1 } },
      { label: "Go inland", flag: "fisher_inland", to: { gx: -1, gy: 0 } }
    ]},
    { id: "scholar", name: "Scholar", gx: 0, gy: -2, x: 280, text: "Knowledge is power.", options: [
      { label: "Study here", flag: "scholar_here", to: { gx: 0, gy: -2 } },
      { label: "Visit the library", flag: "scholar_lib", to: { gx: 1, gy: -2 } },
      { label: "Return to town", flag: "scholar_town", to: { gx: 0, gy: 0 } }
    ]},
    { id: "guard", name: "Guard", gx: 1, gy: 1, x: 150, text: "Halt. State your business.", options: [
      { label: "Stay on post", flag: "guard_post", to: { gx: 1, gy: 1 } },
      { label: "Patrol north", flag: "guard_north", to: { gx: 1, gy: 0 } },
      { label: "Patrol east", flag: "guard_east", to: { gx: 2, gy: 1 } }
    ]},
    { id: "healer", name: "Healer", gx: -1, gy: 1, x: 320, text: "Need mending?", options: [
      { label: "Set up clinic", flag: "healer_clinic", to: { gx: -1, gy: 1 } },
      { label: "Travel to the front", flag: "healer_front", to: { gx: 0, gy: 0 } },
      { label: "Go to the caves", flag: "healer_caves", to: { gx: 2, gy: 0 } }
    ]},
    { id: "bard", name: "Bard", gx: 2, gy: 1, x: 400, text: "A song for the road?", options: [
      { label: "Play here", flag: "bard_here", to: { gx: 2, gy: 1 } },
      { label: "Tour the west", flag: "bard_west", to: { gx: -1, gy: 1 } },
      { label: "Tour the north", flag: "bard_north", to: { gx: 2, gy: -1 } }
    ]},
    { id: "smith", name: "Smith", gx: -2, gy: 1, x: 160, text: "Steel needs fire.", options: [
      { label: "Forge here", flag: "smith_here", to: { gx: -2, gy: 1 } },
      { label: "Move to town", flag: "smith_town", to: { gx: 0, gy: 0 } },
      { label: "Move to the mines", flag: "smith_mines", to: { gx: 2, gy: 0 } }
    ]},
    { id: "farmer", name: "Farmer", gx: 0, gy: 2, x: 300, text: "Crops need tending.", options: [
      { label: "Tend the field", flag: "farmer_field", to: { gx: 0, gy: 2 } },
      { label: "Sell in town", flag: "farmer_town", to: { gx: 0, gy: 1 } },
      { label: "Try the east fields", flag: "farmer_east", to: { gx: 1, gy: 2 } }
    ]},
    { id: "priest", name: "Priest", gx: 1, gy: -1, x: 240, text: "The light guides.", options: [
      { label: "Hold service", flag: "priest_service", to: { gx: 1, gy: -1 } },
      { label: "Visit the sick", flag: "priest_sick", to: { gx: 0, gy: 0 } },
      { label: "Pilgrimage", flag: "priest_pilgrim", to: { gx: 3, gy: -1 } }
    ]},
    { id: "thief", name: "Thief", gx: -1, gy: -1, x: 380, text: "Keep your coin close.", options: [
      { label: "Lie low", flag: "thief_low", to: { gx: -1, gy: -1 } },
      { label: "Move to the market", flag: "thief_market", to: { gx: 0, gy: 0 } },
      { label: "Flee south", flag: "thief_flee", to: { gx: -1, gy: 1 } }
    ]},
    { id: "knight", name: "Knight", gx: 2, gy: -1, x: 200, text: "Duty calls.", options: [
      { label: "Hold the line", flag: "knight_line", to: { gx: 2, gy: -1 } },
      { label: "Reinforce the center", flag: "knight_center", to: { gx: 0, gy: 0 } },
      { label: "Scout the east", flag: "knight_east", to: { gx: 3, gy: -1 } }
    ]},
    { id: "witch", name: "Witch", gx: -2, gy: -1, x: 270, text: "The herbs grow strong.", options: [
      { label: "Gather here", flag: "witch_here", to: { gx: -2, gy: -1 } },
      { label: "Visit the village", flag: "witch_village", to: { gx: 0, gy: 0 } },
      { label: "Retreat deeper", flag: "witch_deep", to: { gx: -3, gy: -1 } }
    ]},
    { id: "captain", name: "Captain", gx: 0, gy: -3, x: 180, text: "The ship needs a crew.", options: [
      { label: "Stay at dock", flag: "captain_dock", to: { gx: 0, gy: -3 } },
      { label: "Sail east", flag: "captain_east", to: { gx: 2, gy: -3 } },
      { label: "Sail west", flag: "captain_west", to: { gx: -2, gy: -3 } }
    ]},
    { id: "innkeeper", name: "Innkeeper", gx: 1, gy: 2, x: 340, text: "A bed for the night?", options: [
      { label: "Keep the inn", flag: "inn_keep", to: { gx: 1, gy: 2 } },
      { label: "Open a new inn", flag: "inn_new", to: { gx: -1, gy: 2 } },
      { label: "Retire to town", flag: "inn_retire", to: { gx: 0, gy: 1 } }
    ]},
    { id: "hermit", name: "Hermit", gx: 3, gy: 1, x: 120, text: "Solitude is peace.", options: [
      { label: "Stay alone", flag: "hermit_alone", to: { gx: 3, gy: 1 } },
      { label: "Visit once", flag: "hermit_visit", to: { gx: 1, gy: 1 } },
      { label: "Move further out", flag: "hermit_far", to: { gx: 4, gy: 1 } }
    ]},
    { id: "ranger", name: "Ranger", gx: -3, gy: 0, x: 360, text: "The wilds are home.", options: [
      { label: "Patrol here", flag: "ranger_here", to: { gx: -3, gy: 0 } },
      { label: "Guide to town", flag: "ranger_town", to: { gx: 0, gy: 0 } },
      { label: "Scout the north", flag: "ranger_north", to: { gx: -3, gy: -1 } }
    ]},
    { id: "alchemist", name: "Alchemist", gx: 2, gy: 2, x: 220, text: "Potions need testing.", options: [
      { label: "Brew here", flag: "alch_here", to: { gx: 2, gy: 2 } },
      { label: "Sell in the market", flag: "alch_market", to: { gx: 0, gy: 0 } },
      { label: "Move to the lab", flag: "alch_lab", to: { gx: 2, gy: -2 } }
    ]},
    { id: "child", name: "Child", gx: 0, gy: 0, x: 500, text: "Can I explore?", options: [
      { label: "Stay safe", flag: "child_safe", to: { gx: 0, gy: 0 } },
      { label: "Play in the east", flag: "child_east", to: { gx: 1, gy: 0 } },
      { label: "Visit the farm", flag: "child_farm", to: { gx: 0, gy: 2 } }
    ]},
    { id: "wanderer", name: "Wanderer", gx: -1, gy: 2, x: 280, text: "The road never ends.", options: [
      { label: "Wander east", flag: "wander_east", to: { gx: 1, gy: 2 } },
      { label: "Wander north", flag: "wander_north", to: { gx: -1, gy: 1 } },
      { label: "Wander west", flag: "wander_west", to: { gx: -2, gy: 2 } }
    ]}
  ];
})(G);
