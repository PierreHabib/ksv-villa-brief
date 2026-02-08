export type MaterialsSectionKey =
  | "wallsCeilings"
  | "floorsStone"
  | "timberJoinery"
  | "metalsTextilesScreens";

export type Finish = {
  id: string;
  title: string;
  finish: string;
  where: string;
  why: string;
  tier: "primary" | "supporting";
  tags: string[];
};

export type PaletteRoles = {
  base: string[];
  stone: string[];
  timber: string[];
  shadow: string[];
  vegetation: string[];
  metal: string[];
};

export type StyleGenreEntry = {
  name: string;
  tone: string;
  coreMoves: string[];
  paletteRoles: PaletteRoles;
  recommendedFinishes: {
    walls: Finish[];
    floors: Finish[];
    timber: Finish[];
    metalsTextilesScreens: Finish[];
  };
};

export const materialSections = [
  { key: "wallsCeilings" as const, label: "Walls & Ceilings" },
  { key: "floorsStone" as const, label: "Floors & Stone" },
  { key: "timberJoinery" as const, label: "Timber & Joinery" },
  {
    key: "metalsTextilesScreens" as const,
    label: "Metals, Textiles & Screens"
  }
] as const;

const makeFinish = (
  id: string,
  title: string,
  finish: string,
  where: string,
  why: string,
  tier: Finish["tier"],
  tags: string[]
): Finish => ({
  id,
  title,
  finish,
  where,
  why,
  tier,
  tags
});

const W = {
  limewash: makeFinish(
    "walls-limewash",
    "Primary wall finish",
    "Limewash (matte)",
    "Main living walls",
    "Breathable base that resists humidity marks.",
    "primary",
    ["breathable", "matte", "calm"]
  ),
  clayPlaster: makeFinish(
    "walls-clay-plaster",
    "Clay plaster wall",
    "Clay plaster (matte)",
    "Feature walls",
    "Soft texture with low glare and depth.",
    "supporting",
    ["textured", "matte", "natural"]
  ),
  microcement: makeFinish(
    "walls-microcement",
    "Microcement wall",
    "Microcement (low sheen)",
    "Wet zones + entries",
    "Durable surface with minimal joints.",
    "primary",
    ["durable", "low-sheen"]
  ),
  whitePlaster: makeFinish(
    "walls-white-plaster",
    "White plaster wall",
    "White mineral plaster",
    "Main living walls",
    "Bright base that reflects filtered daylight.",
    "primary",
    ["bright", "clean"]
  ),
  stoneVeneer: makeFinish(
    "walls-stone-veneer",
    "Stone veneer feature",
    "Stone veneer (textured)",
    "Entry or courtyard wall",
    "Adds mass and cool texture to focal walls.",
    "supporting",
    ["stone", "textured"]
  ),
  timberSlat: makeFinish(
    "walls-timber-slat",
    "Timber slat screen",
    "Timber slats (sealed)",
    "Screens + feature walls",
    "Warm rhythm and filtered privacy.",
    "supporting",
    ["timber", "screened"]
  ),
  wovenScreen: makeFinish(
    "walls-woven-screen",
    "Woven screen wall",
    "Woven rattan screen",
    "Lanai or transition zones",
    "Layered shade with airy texture.",
    "supporting",
    ["screened", "textile"]
  ),
  rawConcrete: makeFinish(
    "walls-raw-concrete",
    "Raw concrete wall",
    "Raw concrete (sealed)",
    "Feature walls",
    "Industrial edge with minimal upkeep.",
    "primary",
    ["industrial", "durable"]
  )
};

const F = {
  honedLimestone: makeFinish(
    "floors-honed-limestone",
    "Honed limestone floor",
    "Honed limestone",
    "Living + circulation floors",
    "Cool underfoot and slip-safe when textured.",
    "primary",
    ["stone", "cool"]
  ),
  terrazzo: makeFinish(
    "floors-terrazzo",
    "Terrazzo floor",
    "Terrazzo (low sheen)",
    "Living floors",
    "Hard-wearing with a refined pattern.",
    "primary",
    ["durable", "crafted"]
  ),
  terracotta: makeFinish(
    "floors-terracotta",
    "Terracotta floor",
    "Terracotta tile",
    "Outdoor terraces",
    "Warm tone with natural grip.",
    "supporting",
    ["warm", "earthy"]
  ),
  polishedConcrete: makeFinish(
    "floors-polished-concrete",
    "Polished concrete floor",
    "Concrete (sealed)",
    "Service + kitchen floors",
    "Extremely durable and easy to maintain.",
    "primary",
    ["industrial", "durable"]
  ),
  teakDeck: makeFinish(
    "floors-teak-deck",
    "Teak deck surface",
    "Teak decking",
    "Outdoor rooms",
    "Warm barefoot feel and quick drainage.",
    "supporting",
    ["timber", "outdoor"]
  ),
  basaltPavers: makeFinish(
    "floors-basalt-pavers",
    "Basalt pavers",
    "Basalt pavers (textured)",
    "Courtyards + pool edges",
    "Non-slip texture for wet zones.",
    "supporting",
    ["slip-safe", "stone"]
  ),
  oakBoard: makeFinish(
    "floors-oak-board",
    "Oak board floor",
    "Engineered oak",
    "Bedrooms",
    "Warm underfoot comfort in private zones.",
    "primary",
    ["timber", "warm"]
  ),
  walnutBoard: makeFinish(
    "floors-walnut-board",
    "Walnut board floor",
    "Walnut timber",
    "Living or study floors",
    "Richer grain for mid-century warmth.",
    "supporting",
    ["timber", "rich"]
  )
};

const T = {
  teakJoinery: makeFinish(
    "timber-teak-joinery",
    "Teak joinery",
    "Teak (satin)",
    "Cabinetry + doors",
    "Classic tropical timber with durability.",
    "primary",
    ["timber", "warm"]
  ),
  oakJoinery: makeFinish(
    "timber-oak-joinery",
    "Oak joinery",
    "Oak (matte)",
    "Built-ins + doors",
    "Clean grain with calm tone.",
    "primary",
    ["timber", "calm"]
  ),
  walnutJoinery: makeFinish(
    "timber-walnut-joinery",
    "Walnut joinery",
    "Walnut (satin)",
    "Feature joinery",
    "Deep tone for refined contrast.",
    "primary",
    ["timber", "rich"]
  ),
  ashJoinery: makeFinish(
    "timber-ash-joinery",
    "Ash joinery",
    "Ash timber",
    "Wardrobes + shelving",
    "Light grain for airy interiors.",
    "primary",
    ["timber", "light"]
  ),
  bambooPanel: makeFinish(
    "timber-bamboo-panel",
    "Bamboo panel",
    "Bamboo paneling",
    "Screens + accents",
    "Fast-growing material with texture.",
    "supporting",
    ["timber", "textured"]
  ),
  rattanPanel: makeFinish(
    "timber-rattan-panel",
    "Rattan panel",
    "Rattan weave",
    "Cabinet fronts",
    "Adds lightness and airflow to joinery.",
    "supporting",
    ["textile", "screened"]
  ),
  reclaimedTimber: makeFinish(
    "timber-reclaimed",
    "Reclaimed timber",
    "Reclaimed wood",
    "Statement joinery",
    "Character grain with sustainable story.",
    "supporting",
    ["timber", "textured"]
  ),
  charredTimber: makeFinish(
    "timber-charred",
    "Charred timber",
    "Shou sugi ban",
    "Feature screens",
    "Deep tone with weather resistance.",
    "supporting",
    ["timber", "dark"]
  )
};

const M = {
  brushedBrass: makeFinish(
    "metal-brushed-brass",
    "Brushed brass hardware",
    "Brushed brass",
    "Handles + fixtures",
    "Warm metal accents that age gracefully.",
    "primary",
    ["metal", "warm"]
  ),
  blackenedSteel: makeFinish(
    "metal-blackened-steel",
    "Blackened steel",
    "Blackened steel",
    "Frames + details",
    "Slim profiles with robust performance.",
    "primary",
    ["metal", "bold"]
  ),
  brushedSteel: makeFinish(
    "metal-brushed-steel",
    "Brushed steel",
    "Brushed stainless",
    "Wet zone hardware",
    "Marine-ready finish for humid zones.",
    "primary",
    ["metal", "durable"]
  ),
  bronzeMesh: makeFinish(
    "metal-bronze-mesh",
    "Bronze mesh screen",
    "Bronze mesh",
    "Facade or stair screens",
    "Softens light while improving privacy.",
    "supporting",
    ["screened", "metal"]
  ),
  linenDrapery: makeFinish(
    "textile-linen",
    "Linen drapery",
    "Linen (sheer)",
    "Bedrooms + living",
    "Softens light and air movement.",
    "supporting",
    ["soft", "textile"]
  ),
  cottonWeave: makeFinish(
    "textile-cotton",
    "Cotton weave",
    "Cotton weave",
    "Lounge textiles",
    "Adds tactile layering without weight.",
    "supporting",
    ["soft", "textile"]
  ),
  timberScreen: makeFinish(
    "screen-timber",
    "Timber screen",
    "Timber screen",
    "Privacy edges",
    "Filters views while keeping airflow.",
    "supporting",
    ["screened", "timber"]
  ),
  perforatedMetal: makeFinish(
    "screen-perforated-metal",
    "Perforated metal screen",
    "Perforated metal",
    "Service screening",
    "Durable shade with airflow.",
    "supporting",
    ["screened", "industrial"]
  )
};

export const STYLE_GENRES: StyleGenreEntry[] = [
  // Palette roles are intentionally distinct per genre to yield visibly different
  // outputs under the same deterministic selection.
  {
    name: "Japanese / Zen (Japandi)",
    tone: "warm neutral",
    coreMoves: ["breathable walls", "low-sheen stone", "quiet timber"],
    paletteRoles: {
      base: ["#F2EDE3", "#E6DED2", "#F7F3EA", "#DDD2C6", "#ECE5D9"],
      stone: ["#D7CEC2", "#CFC5B8", "#E1D8CC", "#C5BCAE", "#BFB5A8"],
      timber: ["#D9C29B", "#CDB68E", "#E1CFA8", "#C2AA82", "#B89F78"],
      shadow: ["#4A4440", "#3F3A36", "#5A5350", "#332E2A", "#504A46"],
      vegetation: ["#7A846D", "#6F7963", "#8A947B", "#636C58", "#75806A"],
      metal: ["#2F2B28", "#3A3531", "#262320", "#45403C", "#1F1C19"]
    },
    recommendedFinishes: {
      walls: [W.limewash, W.clayPlaster, W.whitePlaster, W.timberSlat],
      floors: [F.oakBoard, F.honedLimestone, F.terrazzo, F.basaltPavers],
      timber: [T.oakJoinery, T.ashJoinery, T.teakJoinery, T.bambooPanel],
      metalsTextilesScreens: [
        M.blackenedSteel,
        M.brushedSteel,
        M.linenDrapery,
        M.timberScreen
      ]
    }
  },
  {
    name: "Modern Tropical (Tropical Modernism)",
    tone: "warm neutral",
    coreMoves: ["breezy thresholds", "teak accents", "filtered shade"],
    paletteRoles: {
      base: ["#F4E7D4", "#EEDFC8", "#FAF0E1", "#E3D4BD", "#F0E3D1"],
      stone: ["#D4C2AB", "#C9B79F", "#E0D0BA", "#BFAE96", "#CABAA3"],
      timber: ["#C58A55", "#B97845", "#D19763", "#A66B3E", "#C08852"],
      shadow: ["#6A584B", "#5E4F44", "#7A685B", "#53453B", "#665548"],
      vegetation: ["#2F5B45", "#3A6A50", "#25513D", "#44725A", "#1F4736"],
      metal: ["#C79A63", "#B98954", "#D3A66E", "#AE7F4D", "#BF8F5B"]
    },
    recommendedFinishes: {
      walls: [W.limewash, W.whitePlaster, W.timberSlat, W.stoneVeneer],
      floors: [F.honedLimestone, F.teakDeck, F.basaltPavers, F.terrazzo],
      timber: [T.teakJoinery, T.rattanPanel, T.bambooPanel, T.oakJoinery],
      metalsTextilesScreens: [
        M.brushedBrass,
        M.bronzeMesh,
        M.linenDrapery,
        M.timberScreen
      ]
    }
  },
  {
    name: "Balinese Resort",
    tone: "earthy dark",
    coreMoves: ["layered craft", "stone grounding", "woven texture"],
    paletteRoles: {
      base: ["#E6D5C2", "#DCCAB7", "#F0E1CF", "#D2C0AE", "#E1D0BE"],
      stone: ["#C2AE98", "#B79F89", "#D0BBA6", "#AC937F", "#C7B29D"],
      timber: ["#8E5D37", "#7F4F2E", "#9D6B44", "#714426", "#A3724A"],
      shadow: ["#453A32", "#3A312B", "#52463E", "#2F2722", "#4B3F37"],
      vegetation: ["#3F5A44", "#344E3B", "#4B6550", "#2B4031", "#445C48"],
      metal: ["#7C5C40", "#6F5339", "#8A694A", "#63472F", "#76583D"]
    },
    recommendedFinishes: {
      walls: [W.clayPlaster, W.limewash, W.stoneVeneer, W.wovenScreen],
      floors: [F.terracotta, F.basaltPavers, F.teakDeck, F.honedLimestone],
      timber: [T.teakJoinery, T.bambooPanel, T.rattanPanel, T.reclaimedTimber],
      metalsTextilesScreens: [
        M.bronzeMesh,
        M.brushedBrass,
        M.cottonWeave,
        M.timberScreen
      ]
    }
  },
  {
    name: "Thai Contemporary",
    tone: "warm neutral",
    coreMoves: ["crafted timber", "polished stone", "screened edges"],
    paletteRoles: {
      base: ["#F1E4D2", "#E8DAC8", "#F7ECDD", "#DDD0BE", "#EDE0CF"],
      stone: ["#C8B7A4", "#BFAF9C", "#D4C4B1", "#B3A391", "#C1B19E"],
      timber: ["#A77245", "#996A3F", "#B07C50", "#8B5D35", "#A06F43"],
      shadow: ["#5A5048", "#4F4640", "#665C54", "#433B35", "#5F544D"],
      vegetation: ["#4C6652", "#415A47", "#5A725F", "#374C3D", "#536B57"],
      metal: ["#B08A60", "#A27C55", "#BC956A", "#97714B", "#AE875B"]
    },
    recommendedFinishes: {
      walls: [W.microcement, W.limewash, W.stoneVeneer, W.timberSlat],
      floors: [F.honedLimestone, F.terrazzo, F.basaltPavers, F.teakDeck],
      timber: [T.teakJoinery, T.walnutJoinery, T.oakJoinery, T.rattanPanel],
      metalsTextilesScreens: [
        M.brushedBrass,
        M.bronzeMesh,
        M.linenDrapery,
        M.timberScreen
      ]
    }
  },
  {
    name: "Traditional Thai",
    tone: "earthy dark",
    coreMoves: ["ornate timber", "courtyard shade", "warm stone"],
    paletteRoles: {
      base: ["#E3D0BC", "#D9C4B0", "#EEE0CD", "#CEB9A6", "#E0CBB7"],
      stone: ["#BFA48B", "#B3977F", "#CDB29A", "#A78C74", "#B69B83"],
      timber: ["#7F4F2C", "#6F4225", "#8F5D36", "#5E351E", "#9B6940"],
      shadow: ["#3F322B", "#332823", "#4C3E35", "#2A211D", "#453831"],
      vegetation: ["#3A5A3F", "#2F4A34", "#46654B", "#25402C", "#3F5D44"],
      metal: ["#8B6A4C", "#7D5D41", "#9A7758", "#6F5138", "#856244"]
    },
    recommendedFinishes: {
      walls: [W.limewash, W.clayPlaster, W.timberSlat, W.wovenScreen],
      floors: [F.terracotta, F.basaltPavers, F.teakDeck, F.honedLimestone],
      timber: [T.teakJoinery, T.bambooPanel, T.rattanPanel, T.reclaimedTimber],
      metalsTextilesScreens: [
        M.brushedBrass,
        M.bronzeMesh,
        M.cottonWeave,
        M.timberScreen
      ]
    }
  },
  {
    name: "Mediterranean Coastal",
    tone: "warm neutral",
    coreMoves: ["sun-washed walls", "terracotta floors", "soft brass"],
    paletteRoles: {
      base: ["#FFF3E2", "#F7EBD8", "#FDF7EE", "#F1E4D1", "#F9EEDC"],
      stone: ["#E4D5C1", "#D9CAB6", "#EEDFCC", "#CEBFA9", "#D5C6B2"],
      timber: ["#C68B5A", "#B97F51", "#D39A69", "#A86E43", "#C08852"],
      shadow: ["#A79A8F", "#9A8E83", "#B2A69B", "#8C8076", "#A09488"],
      vegetation: ["#7E8B6D", "#6F7C5F", "#8A9776", "#5F6D52", "#78866A"],
      metal: ["#C08E6A", "#B07D5A", "#CFA079", "#A36E4C", "#B7845E"]
    },
    recommendedFinishes: {
      walls: [W.whitePlaster, W.limewash, W.stoneVeneer, W.clayPlaster],
      floors: [F.terracotta, F.honedLimestone, F.terrazzo, F.basaltPavers],
      timber: [T.oakJoinery, T.walnutJoinery, T.reclaimedTimber, T.teakJoinery],
      metalsTextilesScreens: [
        M.brushedBrass,
        M.blackenedSteel,
        M.linenDrapery,
        M.bronzeMesh
      ]
    }
  },
  {
    name: "Scandinavian Minimal",
    tone: "cool light",
    coreMoves: ["light timber", "clean plaster", "soft textiles"],
    paletteRoles: {
      base: ["#F4F6F7", "#EEF1F3", "#FAFBFC", "#E3E7EA", "#F0F2F4"],
      stone: ["#CDD2D6", "#C1C7CC", "#D8DDE1", "#B5BCC1", "#C9CED3"],
      timber: ["#E0D3B6", "#D6C8AA", "#E8DBC0", "#CBBEA2", "#DCCFAF"],
      shadow: ["#5A5E62", "#4E5357", "#676C70", "#43484C", "#5F6468"],
      vegetation: ["#7A867B", "#6E7B70", "#879489", "#626E64", "#738076"],
      metal: ["#8E9398", "#7F858B", "#9BA1A6", "#72787E", "#888D92"]
    },
    recommendedFinishes: {
      walls: [W.whitePlaster, W.limewash, W.microcement, W.clayPlaster],
      floors: [F.oakBoard, F.honedLimestone, F.terrazzo, F.polishedConcrete],
      timber: [T.oakJoinery, T.ashJoinery, T.walnutJoinery, T.teakJoinery],
      metalsTextilesScreens: [
        M.brushedSteel,
        M.blackenedSteel,
        M.linenDrapery,
        M.timberScreen
      ]
    }
  },
  {
    name: "Rustic Natural",
    tone: "earthy dark",
    coreMoves: ["textured plaster", "reclaimed timber", "stone grounding"],
    paletteRoles: {
      base: ["#E0D2C0", "#D4C5B3", "#EADDCB", "#C8B9A7", "#DACBB9"],
      stone: ["#B8A18B", "#AC947E", "#C5B09A", "#9E866F", "#B29B84"],
      timber: ["#7A4B2B", "#6C4024", "#875637", "#5D351E", "#90603E"],
      shadow: ["#44372F", "#392E27", "#50433B", "#2E241F", "#493C34"],
      vegetation: ["#455944", "#3B4D3A", "#516652", "#2F3F31", "#4A5E4A"],
      metal: ["#6F5947", "#5F4C3C", "#7D6652", "#534233", "#665141"]
    },
    recommendedFinishes: {
      walls: [W.clayPlaster, W.limewash, W.stoneVeneer, W.timberSlat],
      floors: [F.terracotta, F.basaltPavers, F.honedLimestone, F.oakBoard],
      timber: [T.reclaimedTimber, T.charredTimber, T.teakJoinery, T.oakJoinery],
      metalsTextilesScreens: [
        M.blackenedSteel,
        M.bronzeMesh,
        M.linenDrapery,
        M.timberScreen
      ]
    }
  },
  {
    name: "Boho Eclectic",
    tone: "warm neutral",
    coreMoves: ["woven texture", "soft plaster", "layered textiles"],
    paletteRoles: {
      base: ["#F2DDC7", "#EAD2BB", "#F9E7D3", "#E1C9B1", "#F0D8C1"],
      stone: ["#C8A88C", "#BD9E82", "#D6B79B", "#B08F74", "#C2A186"],
      timber: ["#B97846", "#AA6E41", "#C88654", "#9C6237", "#B17447"],
      shadow: ["#6B5244", "#5E483B", "#775C4D", "#4F3C31", "#634B3E"],
      vegetation: ["#6B7A5E", "#5E6D52", "#788765", "#4F5E45", "#667559"],
      metal: ["#B07A56", "#A06C4A", "#C28B63", "#93603F", "#B5825D"]
    },
    recommendedFinishes: {
      walls: [W.limewash, W.clayPlaster, W.whitePlaster, W.wovenScreen],
      floors: [F.terracotta, F.teakDeck, F.terrazzo, F.honedLimestone],
      timber: [T.rattanPanel, T.bambooPanel, T.teakJoinery, T.reclaimedTimber],
      metalsTextilesScreens: [
        M.brushedBrass,
        M.cottonWeave,
        M.linenDrapery,
        M.timberScreen
      ]
    }
  },
  {
    name: "Industrial Modern",
    tone: "crisp clean",
    coreMoves: ["raw concrete", "black steel", "durable floors"],
    paletteRoles: {
      base: ["#DEE1E4", "#D2D6DA", "#E8EBEE", "#C6CBD0", "#D9DDE1"],
      stone: ["#B3B8BC", "#A7ACB1", "#C0C5C9", "#9A9FA4", "#B1B6BA"],
      timber: ["#8E775F", "#7E6954", "#9C846B", "#6F5B47", "#887159"],
      shadow: ["#2F3235", "#25282B", "#3A3E41", "#1C1F22", "#313437"],
      vegetation: ["#55605A", "#4A5450", "#606B66", "#3F4945", "#515C57"],
      metal: ["#3A3F44", "#2E3338", "#454A50", "#23282D", "#363B40"]
    },
    recommendedFinishes: {
      walls: [W.rawConcrete, W.microcement, W.stoneVeneer, W.whitePlaster],
      floors: [F.polishedConcrete, F.basaltPavers, F.terrazzo, F.honedLimestone],
      timber: [T.charredTimber, T.walnutJoinery, T.oakJoinery, T.reclaimedTimber],
      metalsTextilesScreens: [
        M.blackenedSteel,
        M.brushedSteel,
        M.perforatedMetal,
        M.bronzeMesh
      ]
    }
  },
  {
    name: "Mid-century Modern",
    tone: "warm neutral",
    coreMoves: ["terrazzo floors", "walnut joinery", "graphic brass"],
    paletteRoles: {
      base: ["#EFE0CD", "#E6D6C2", "#F5E6D4", "#DCCCB8", "#EADAC7"],
      stone: ["#C7B19A", "#BBA48E", "#D2BCA5", "#AF9883", "#C1AB95"],
      timber: ["#8C5836", "#7F4D30", "#99633E", "#6F4126", "#A16B45"],
      shadow: ["#5B4A41", "#4F3F37", "#67554B", "#42342D", "#5F4D44"],
      vegetation: ["#5F7056", "#53654B", "#6A7A60", "#46563F", "#596A51"],
      metal: ["#B5885C", "#A8784E", "#C19569", "#996A42", "#B07F56"]
    },
    recommendedFinishes: {
      walls: [W.limewash, W.microcement, W.timberSlat, W.whitePlaster],
      floors: [F.terrazzo, F.walnutBoard, F.honedLimestone, F.teakDeck],
      timber: [T.walnutJoinery, T.teakJoinery, T.oakJoinery, T.rattanPanel],
      metalsTextilesScreens: [
        M.brushedBrass,
        M.blackenedSteel,
        M.linenDrapery,
        M.timberScreen
      ]
    }
  },
  {
    name: "Contemporary Luxury",
    tone: "crisp clean",
    coreMoves: ["refined stone", "quiet timber", "brushed brass"],
    paletteRoles: {
      base: ["#F2E7D8", "#E9DED0", "#F7EDE0", "#DED3C5", "#EFE4D6"],
      stone: ["#C9BBAA", "#BFB2A1", "#D6C8B7", "#B2A694", "#C3B7A6"],
      timber: ["#A97A50", "#9C7048", "#B58A5E", "#8F6440", "#A2734A"],
      shadow: ["#4F4A44", "#43403B", "#5B564F", "#383530", "#49443F"],
      vegetation: ["#5B6A5C", "#4F5E51", "#667566", "#3F4C41", "#576657"],
      metal: ["#C7A57C", "#B9956C", "#D3B088", "#AA8560", "#C09B73"]
    },
    recommendedFinishes: {
      walls: [W.stoneVeneer, W.limewash, W.microcement, W.whitePlaster],
      floors: [F.honedLimestone, F.terrazzo, F.polishedConcrete, F.basaltPavers],
      timber: [T.walnutJoinery, T.oakJoinery, T.teakJoinery, T.ashJoinery],
      metalsTextilesScreens: [
        M.brushedBrass,
        M.bronzeMesh,
        M.brushedSteel,
        M.linenDrapery
      ]
    }
  }
];

export const paletteOrder = [
  { key: "base", label: "Base" },
  { key: "stone", label: "Stone" },
  { key: "timber", label: "Timber" },
  { key: "shadow", label: "Shadow" },
  { key: "vegetation", label: "Vegetation" },
  { key: "metal", label: "Metal" }
] as const;
