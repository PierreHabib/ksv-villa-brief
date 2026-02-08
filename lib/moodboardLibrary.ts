export type MoodboardSection =
  | "architecture_language"
  | "materials_detailing"
  | "outdoor_living_landscape"
  | "interior_mood_lighting";

export type TileKind =
  | "roof_eaves"
  | "courtyard_screen"
  | "threshold_veranda"
  | "floor_finish"
  | "wall_finish"
  | "timber_joinery"
  | "pool_edge"
  | "terrace_surface"
  | "planting_reference"
  | "lighting_reference"
  | "bathroom_set"
  | "textile_softness";

export type MoodTile = {
  id: string;
  section: MoodboardSection;
  kind: TileKind;
  title: string;
  src: string;
  alt: string;
  tags: string[];
  captionTemplate: {
    where: string;
    material: string;
    intent: string;
  };
};

export const moodboardLibrary: MoodTile[] = [
  // Architecture Language
  {
    id: "arch-01",
    section: "architecture_language",
    kind: "roof_eaves",
    title: "Deep Roof Eaves",
    src: "/moodboard/roof-eaves_deep-overhang_01.jpg",
    alt: "Deep roof eaves reference",
    tags: ["tropical_modern", "outdoor_first", "shade", "high"],
    captionTemplate: {
      where: "roof edge",
      material: "timber soffit",
      intent: "deep shade + rain control"
    }
  },
  {
    id: "arch-02",
    section: "architecture_language",
    kind: "courtyard_screen",
    title: "Screened Courtyard",
    src: "/moodboard/courtyard_screened-privacy_02.jpg",
    alt: "Screened courtyard reference",
    tags: ["high", "courtyard", "secluded", "contemporary_thai"],
    captionTemplate: {
      where: "courtyard",
      material: "screened lattice",
      intent: "privacy + filtered light"
    }
  },
  {
    id: "arch-03",
    section: "architecture_language",
    kind: "threshold_veranda",
    title: "Veranda Threshold",
    src: "/moodboard/threshold_veranda-breeze_01.jpg",
    alt: "Veranda threshold reference",
    tags: ["balanced", "outdoor_first", "breeze", "tropical_modern"],
    captionTemplate: {
      where: "threshold",
      material: "timber + stone",
      intent: "breezy indoor-outdoor flow"
    }
  },
  {
    id: "arch-04",
    section: "architecture_language",
    kind: "roof_eaves",
    title: "Layered Roofline",
    src: "/moodboard/roof-eaves_layered-profile_02.jpg",
    alt: "Layered roofline reference",
    tags: ["rustic_minimal", "balanced", "shade"],
    captionTemplate: {
      where: "roofline",
      material: "clay tile",
      intent: "scale + thermal comfort"
    }
  },
  {
    id: "arch-05",
    section: "architecture_language",
    kind: "courtyard_screen",
    title: "Privacy Screens",
    src: "/moodboard/courtyard_screened-privacy_03.jpg",
    alt: "Privacy screens reference",
    tags: ["high", "screened", "privacy"],
    captionTemplate: {
      where: "facade",
      material: "timber screens",
      intent: "buffered views + airflow"
    }
  },
  {
    id: "arch-06",
    section: "architecture_language",
    kind: "threshold_veranda",
    title: "Entry Threshold",
    src: "/moodboard/threshold_arrival-gallery_01.jpg",
    alt: "Entry threshold reference",
    tags: ["standard", "balanced", "contemporary_thai"],
    captionTemplate: {
      where: "arrival",
      material: "stone + wood",
      intent: "clear wayfinding"
    }
  },

  // Materials & Detailing
  {
    id: "mat-01",
    section: "materials_detailing",
    kind: "floor_finish",
    title: "Honed Limestone",
    src: "/moodboard/floor_finish_honed-limestone_01.jpg",
    alt: "Honed limestone floor",
    tags: ["tropical_modern", "standard", "warm"],
    captionTemplate: {
      where: "main floor",
      material: "honed limestone",
      intent: "cool underfoot"
    }
  },
  {
    id: "mat-02",
    section: "materials_detailing",
    kind: "wall_finish",
    title: "Textured Plaster",
    src: "/moodboard/wall_finish_textured-plaster_02.jpg",
    alt: "Textured plaster wall",
    tags: ["rustic_minimal", "calm", "natural"],
    captionTemplate: {
      where: "feature wall",
      material: "lime plaster",
      intent: "soft matte backdrop"
    }
  },
  {
    id: "mat-03",
    section: "materials_detailing",
    kind: "timber_joinery",
    title: "Teak Joinery",
    src: "/moodboard/timber_joinery_teak-detail_01.jpg",
    alt: "Teak joinery detail",
    tags: ["tropical_modern", "timber", "crafted"],
    captionTemplate: {
      where: "cabinetry",
      material: "solid teak",
      intent: "durable + warm grain"
    }
  },
  {
    id: "mat-04",
    section: "materials_detailing",
    kind: "wall_finish",
    title: "Dark Stone",
    src: "/moodboard/wall_finish_dark-stone_01.jpg",
    alt: "Dark stone wall",
    tags: ["contemporary_thai", "stone", "crafted"],
    captionTemplate: {
      where: "accent wall",
      material: "dark stone",
      intent: "grounded contrast"
    }
  },
  {
    id: "mat-05",
    section: "materials_detailing",
    kind: "floor_finish",
    title: "Terrazzo Aggregate",
    src: "/moodboard/floor_finish_terrazzo_01.jpg",
    alt: "Terrazzo floor",
    tags: ["modern", "standard", "balanced"],
    captionTemplate: {
      where: "wet zones",
      material: "terrazzo",
      intent: "durable + easy clean"
    }
  },
  {
    id: "mat-06",
    section: "materials_detailing",
    kind: "timber_joinery",
    title: "Rattan Panel",
    src: "/moodboard/timber_joinery_rattan-panel_01.jpg",
    alt: "Rattan panel",
    tags: ["tropical_modern", "light", "natural"],
    captionTemplate: {
      where: "screens",
      material: "rattan weave",
      intent: "light diffusion"
    }
  },

  // Outdoor Living & Landscape
  {
    id: "out-01",
    section: "outdoor_living_landscape",
    kind: "pool_edge",
    title: "Stone Pool Coping",
    src: "/moodboard/pool-edge_stone-coping_01.jpg",
    alt: "Stone pool coping",
    tags: ["outdoor_first", "pool", "tropical_modern"],
    captionTemplate: {
      where: "pool edge",
      material: "flamed stone",
      intent: "non-slip + cool underfoot"
    }
  },
  {
    id: "out-02",
    section: "outdoor_living_landscape",
    kind: "terrace_surface",
    title: "Terrace Decking",
    src: "/moodboard/terrace_surface_wood-deck_01.jpg",
    alt: "Terrace decking",
    tags: ["outdoor_first", "breeze", "warm"],
    captionTemplate: {
      where: "terrace",
      material: "timber decking",
      intent: "soft barefoot comfort"
    }
  },
  {
    id: "out-03",
    section: "outdoor_living_landscape",
    kind: "planting_reference",
    title: "Dense Planting",
    src: "/moodboard/planting_reference_dense-tropical_01.jpg",
    alt: "Dense planting reference",
    tags: ["high", "screened", "secluded"],
    captionTemplate: {
      where: "boundary",
      material: "tropical planting",
      intent: "visual buffer"
    }
  },
  {
    id: "out-04",
    section: "outdoor_living_landscape",
    kind: "pool_edge",
    title: "Reflective Basin",
    src: "/moodboard/pool-edge_reflective-basin_01.jpg",
    alt: "Reflective basin",
    tags: ["balanced", "calm", "standard"],
    captionTemplate: {
      where: "water feature",
      material: "dark stone",
      intent: "calming reflections"
    }
  },
  {
    id: "out-05",
    section: "outdoor_living_landscape",
    kind: "terrace_surface",
    title: "Stone Terrace",
    src: "/moodboard/terrace_surface_stone-paver_01.jpg",
    alt: "Stone terrace",
    tags: ["balanced", "standard", "rustic_minimal"],
    captionTemplate: {
      where: "outdoor floor",
      material: "stone pavers",
      intent: "durable + low glare"
    }
  },
  {
    id: "out-06",
    section: "outdoor_living_landscape",
    kind: "planting_reference",
    title: "Courtyard Green",
    src: "/moodboard/planting_reference_courtyard-green_01.jpg",
    alt: "Courtyard planting",
    tags: ["courtyard", "high", "secluded"],
    captionTemplate: {
      where: "courtyard",
      material: "lush planting",
      intent: "cool microclimate"
    }
  },

  // Interior Mood & Lighting
  {
    id: "int-01",
    section: "interior_mood_lighting",
    kind: "lighting_reference",
    title: "Warm Indirect",
    src: "/moodboard/lighting_warm-indirect_03.jpg",
    alt: "Warm indirect lighting",
    tags: ["warm", "calm", "contemporary_thai"],
    captionTemplate: {
      where: "living",
      material: "indirect cove",
      intent: "soft evening glow"
    }
  },
  {
    id: "int-02",
    section: "interior_mood_lighting",
    kind: "bathroom_set",
    title: "Stone Bath Set",
    src: "/moodboard/bathroom_set_stone-vanity_01.jpg",
    alt: "Stone bathroom set",
    tags: ["stone", "spa", "calm"],
    captionTemplate: {
      where: "bath",
      material: "stone vanity",
      intent: "spa-like calm"
    }
  },
  {
    id: "int-03",
    section: "interior_mood_lighting",
    kind: "textile_softness",
    title: "Linen Softness",
    src: "/moodboard/textile_softness_linen_01.jpg",
    alt: "Linen textile",
    tags: ["light", "natural", "calm"],
    captionTemplate: {
      where: "bedroom",
      material: "linen drapery",
      intent: "soft acoustic feel"
    }
  },
  {
    id: "int-04",
    section: "interior_mood_lighting",
    kind: "lighting_reference",
    title: "Task Lighting",
    src: "/moodboard/lighting_reference_task_01.jpg",
    alt: "Task lighting",
    tags: ["standard", "balanced"],
    captionTemplate: {
      where: "kitchen",
      material: "focused lighting",
      intent: "clarity + function"
    }
  },
  {
    id: "int-05",
    section: "interior_mood_lighting",
    kind: "bathroom_set",
    title: "Timber Vanity",
    src: "/moodboard/bathroom_set_timber-vanity_01.jpg",
    alt: "Timber vanity",
    tags: ["timber", "warm", "tropical_modern"],
    captionTemplate: {
      where: "bath",
      material: "timber + stone",
      intent: "warm tactile touch"
    }
  },
  {
    id: "int-06",
    section: "interior_mood_lighting",
    kind: "textile_softness",
    title: "Textile Layer",
    src: "/moodboard/textile_softness_woven_01.jpg",
    alt: "Woven textile",
    tags: ["rustic_minimal", "textured", "warm"],
    captionTemplate: {
      where: "living",
      material: "woven textile",
      intent: "soften acoustic"
    }
  }
];

export const moodboardTiles: MoodTile[] = moodboardLibrary;
