import type {
  BohSeparation,
  GenerateRequest,
  IndoorOutdoor,
  MaterialMood,
  Privacy,
  Staffing,
  Stairs,
  Style,
  WhoStays,
  Pool,
  Parking,
  FlexSpace
} from "@/lib/types";

export type MoodboardSectionId =
  | "architecture_language"
  | "materials_detailing"
  | "outdoor_living_landscape"
  | "interior_mood_lighting";

export type MoodboardTileKind =
  | "massing_courtyard"
  | "roof_eaves"
  | "facade_screens"
  | "primary_surface"
  | "timber_language"
  | "stone_language"
  | "terrace_veranda"
  | "pool_edge"
  | "planting_density"
  | "living_mood"
  | "lighting_reference"
  | "bed_bath_calm";

export type MoodboardTile = {
  id: string;
  section: MoodboardSectionId;
  kind: MoodboardTileKind;
  title: string;
  tags: string[];
  captionTokens: string[];
  image: {
    type: "local";
    src: string;
    alt: string;
  };
};

export type BuiltMoodboard = {
  sections: Array<{
    id: MoodboardSectionId;
    label: string;
    tiles: Array<{
      id: string;
      kind: MoodboardTileKind;
      title: string;
      caption: string;
      src: string;
      alt: string;
    }>;
  }>;
};

type SectionDef = { id: MoodboardSectionId; label: string };

type TileBase = {
  id: string;
  section: MoodboardSectionId;
  kind: MoodboardTileKind;
  title: string;
  tags: string[];
  captionTokens: string[];
  assetId: string;
};

const SECTION_DEFS: SectionDef[] = [
  { id: "architecture_language", label: "Architecture Language" },
  { id: "materials_detailing", label: "Material Palette & Detailing" },
  {
    id: "outdoor_living_landscape",
    label: "Indoor–Outdoor Living & Landscape"
  },
  { id: "interior_mood_lighting", label: "Interior Mood & Lighting" }
];

const SECTION_ASSET_SLUGS: Record<MoodboardSectionId, string> = {
  architecture_language: "architecture",
  materials_detailing: "materials-texture",
  outdoor_living_landscape: "landscape-outdoor-living",
  interior_mood_lighting: "interior-mood-details"
};

const STYLE_SLUGS: Record<Style, string> = {
  "Tropical Modern": "tropical-modern",
  "Contemporary Thai": "contemporary-thai",
  "Resort Minimal": "resort-minimal",
  "Rustic Minimal": "rustic-minimal",
  "Mid-century tropical": "mid-century-tropical",
  "Eco-modern": "eco-modern"
};

const TILE_LIBRARY_BASE: TileBase[] = [
  // Architecture Language
  {
    id: "arch-01",
    section: "architecture_language",
    kind: "massing_courtyard",
    title: "Courtyard Massing",
    tags: ["courtyard", "inward", "screened", "buffered"],
    captionTokens: ["layered", "shaded", "inward"],
    assetId: "01"
  },
  {
    id: "arch-02",
    section: "architecture_language",
    kind: "roof_eaves",
    title: "Roof Eaves",
    tags: ["roof", "eaves", "shade", "tropical", "breeze"],
    captionTokens: ["deep", "shaded", "tropical"],
    assetId: "02"
  },
  {
    id: "arch-03",
    section: "architecture_language",
    kind: "facade_screens",
    title: "Facade Screens",
    tags: ["screened", "privacy", "thai", "crafted"],
    captionTokens: ["screened", "crafted", "filtered"],
    assetId: "03"
  },
  {
    id: "arch-04",
    section: "architecture_language",
    kind: "massing_courtyard",
    title: "Arrival Pavilion",
    tags: ["arrival", "open", "social", "modern"],
    captionTokens: ["welcoming", "open", "modern"],
    assetId: "04"
  },
  {
    id: "arch-05",
    section: "architecture_language",
    kind: "terrace_veranda",
    title: "Terrace Edge",
    tags: ["terrace", "view", "open"],
    captionTokens: ["view-facing", "open", "light"],
    assetId: "05"
  },
  {
    id: "arch-06",
    section: "architecture_language",
    kind: "facade_screens",
    title: "Screened Gallery",
    tags: ["screened", "ventilated", "transition"],
    captionTokens: ["filtered", "ventilated", "calm"],
    assetId: "06"
  },
  {
    id: "arch-07",
    section: "architecture_language",
    kind: "massing_courtyard",
    title: "Garden Spine",
    tags: ["garden", "transition", "veranda"],
    captionTokens: ["linear", "lush", "calm"],
    assetId: "07"
  },
  {
    id: "arch-08",
    section: "architecture_language",
    kind: "massing_courtyard",
    title: "Quiet Wing",
    tags: ["separation", "private", "buffered"],
    captionTokens: ["buffered", "quiet", "private"],
    assetId: "08"
  },

  // Materials & Detailing
  {
    id: "mat-01",
    section: "materials_detailing",
    kind: "timber_language",
    title: "Teak Slat Wall",
    tags: ["teak", "timber", "warm", "tropical"],
    captionTokens: ["warm", "matte", "linear"],
    assetId: "01"
  },
  {
    id: "mat-02",
    section: "materials_detailing",
    kind: "stone_language",
    title: "Warm Limestone",
    tags: ["limestone", "stone", "warm"],
    captionTokens: ["sandy", "honed", "soft"],
    assetId: "02"
  },
  {
    id: "mat-03",
    section: "materials_detailing",
    kind: "timber_language",
    title: "Rattan Weave",
    tags: ["rattan", "woven", "natural"],
    captionTokens: ["woven", "tactile", "light"],
    assetId: "03"
  },
  {
    id: "mat-04",
    section: "materials_detailing",
    kind: "primary_surface",
    title: "Plaster Texture",
    tags: ["plaster", "matte", "minimal"],
    captionTokens: ["chalky", "hand-finished", "soft"],
    assetId: "04"
  },
  {
    id: "mat-05",
    section: "materials_detailing",
    kind: "primary_surface",
    title: "Linen Weave",
    tags: ["linen", "soft", "light"],
    captionTokens: ["soft", "breathable", "calm"],
    assetId: "05"
  },
  {
    id: "mat-06",
    section: "materials_detailing",
    kind: "primary_surface",
    title: "Terrazzo Aggregate",
    tags: ["terrazzo", "crafted", "modern"],
    captionTokens: ["speckled", "polished", "clean"],
    assetId: "06"
  },
  {
    id: "mat-07",
    section: "materials_detailing",
    kind: "primary_surface",
    title: "Bronze Hardware",
    tags: ["bronze", "metal", "crafted"],
    captionTokens: ["brushed", "warm", "metal"],
    assetId: "07"
  },
  {
    id: "mat-08",
    section: "materials_detailing",
    kind: "stone_language",
    title: "Basalt Stone",
    tags: ["basalt", "stone", "dark"],
    captionTokens: ["dark", "dense", "grounded"],
    assetId: "08"
  },
  {
    id: "mat-09",
    section: "materials_detailing",
    kind: "timber_language",
    title: "Charred Timber",
    tags: ["timber", "rustic", "textured"],
    captionTokens: ["smoked", "textured", "deep"],
    assetId: "09"
  },
  {
    id: "mat-10",
    section: "materials_detailing",
    kind: "stone_language",
    title: "Travertine",
    tags: ["travertine", "stone", "refined"],
    captionTokens: ["linear", "honed", "porous"],
    assetId: "10"
  },
  {
    id: "mat-11",
    section: "materials_detailing",
    kind: "primary_surface",
    title: "Clay Tile",
    tags: ["clay", "earthy", "rustic"],
    captionTokens: ["warm", "crafted", "matte"],
    assetId: "11"
  },
  {
    id: "mat-12",
    section: "materials_detailing",
    kind: "timber_language",
    title: "Cane Panels",
    tags: ["cane", "woven", "tropical"],
    captionTokens: ["light", "airy", "woven"],
    assetId: "12"
  },

  // Outdoor Living & Landscape
  {
    id: "out-01",
    section: "outdoor_living_landscape",
    kind: "terrace_veranda",
    title: "Pool Terrace",
    tags: ["pool", "terrace", "outdoor", "breeze"],
    captionTokens: ["sun-washed", "relaxed", "open"],
    assetId: "01"
  },
  {
    id: "out-02",
    section: "outdoor_living_landscape",
    kind: "massing_courtyard",
    title: "Garden Courtyard",
    tags: ["courtyard", "lush", "private"],
    captionTokens: ["lush", "enclosed", "calm"],
    assetId: "02"
  },
  {
    id: "out-03",
    section: "outdoor_living_landscape",
    kind: "terrace_veranda",
    title: "Shaded Veranda",
    tags: ["veranda", "transition", "shade"],
    captionTokens: ["breezy", "covered", "soft"],
    assetId: "03"
  },
  {
    id: "out-04",
    section: "outdoor_living_landscape",
    kind: "terrace_veranda",
    title: "Outdoor Lounge",
    tags: ["outdoor", "social", "terrace"],
    captionTokens: ["low seating", "soft shade", "social"],
    assetId: "04"
  },
  {
    id: "out-05",
    section: "outdoor_living_landscape",
    kind: "planting_density",
    title: "Tropical Planting",
    tags: ["planting", "tropical", "buffered"],
    captionTokens: ["dense", "layered", "green"],
    assetId: "05"
  },
  {
    id: "out-06",
    section: "outdoor_living_landscape",
    kind: "pool_edge",
    title: "Water Edge",
    tags: ["water", "calm", "view"],
    captionTokens: ["reflective", "quiet", "cool"],
    assetId: "06"
  },
  {
    id: "out-07",
    section: "outdoor_living_landscape",
    kind: "planting_density",
    title: "Forest Screen",
    tags: ["screened", "privacy", "buffered"],
    captionTokens: ["green", "filtered", "private"],
    assetId: "07"
  },
  {
    id: "out-08",
    section: "outdoor_living_landscape",
    kind: "terrace_veranda",
    title: "Sun Deck",
    tags: ["open", "social", "sun"],
    captionTokens: ["open", "warm", "social"],
    assetId: "08"
  },

  // Interior Mood & Lighting
  {
    id: "int-01",
    section: "interior_mood_lighting",
    kind: "living_mood",
    title: "Living Lounge",
    tags: ["living", "airy", "open", "modern"],
    captionTokens: ["soft", "airy", "relaxed"],
    assetId: "01"
  },
  {
    id: "int-02",
    section: "interior_mood_lighting",
    kind: "lighting_reference",
    title: "Dining Glow",
    tags: ["dining", "warm", "communal"],
    captionTokens: ["warm", "communal", "glow"],
    assetId: "02"
  },
  {
    id: "int-03",
    section: "interior_mood_lighting",
    kind: "bed_bath_calm",
    title: "Bedroom Calm",
    tags: ["bedroom", "calm", "private"],
    captionTokens: ["quiet", "minimal", "calm"],
    assetId: "03"
  },
  {
    id: "int-04",
    section: "interior_mood_lighting",
    kind: "bed_bath_calm",
    title: "Bath Retreat",
    tags: ["bath", "spa", "stone"],
    captionTokens: ["stone", "spa", "retreat"],
    assetId: "04"
  },
  {
    id: "int-05",
    section: "interior_mood_lighting",
    kind: "living_mood",
    title: "Detail Joinery",
    tags: ["joinery", "crafted", "timber"],
    captionTokens: ["precise", "crafted", "warm"],
    assetId: "05"
  },
  {
    id: "int-06",
    section: "interior_mood_lighting",
    kind: "lighting_reference",
    title: "Service Detail",
    tags: ["service", "discreet_service", "back_of_house"],
    captionTokens: ["discreet", "functional", "quiet"],
    assetId: "06"
  },
  {
    id: "int-07",
    section: "interior_mood_lighting",
    kind: "living_mood",
    title: "Textile Layering",
    tags: ["textile", "soft", "natural"],
    captionTokens: ["woven", "soft", "tactile"],
    assetId: "07"
  },
  {
    id: "int-08",
    section: "interior_mood_lighting",
    kind: "lighting_reference",
    title: "Lighting Accent",
    tags: ["lighting", "ambient", "warm"],
    captionTokens: ["low glow", "ambient", "warm"],
    assetId: "08"
  }
];

const DEFAULT_TILE_IDS: Record<MoodboardSectionId, string[]> = {
  architecture_language: ["arch-01", "arch-02", "arch-03"],
  materials_detailing: ["mat-01", "mat-02", "mat-04"],
  outdoor_living_landscape: ["out-01", "out-02", "out-03"],
  interior_mood_lighting: ["int-01", "int-02", "int-03"]
};

const styleKeywords: Record<Style, string[]> = {
  "Tropical Modern": ["tropical", "modern", "warm", "airy"],
  "Contemporary Thai": ["thai", "timber", "stone", "crafted"],
  "Resort Minimal": ["resort", "minimal", "calm", "refined"],
  "Rustic Minimal": ["rustic", "textured", "calm", "natural"],
  "Mid-century tropical": ["mid-century", "tropical", "timber", "warm"],
  "Eco-modern": ["eco", "modern", "natural", "light"]
};

const privacyKeywords: Record<Privacy, string[]> = {
  "Very private (secluded)": [
    "screened",
    "buffered",
    "courtyard",
    "inward",
    "secluded"
  ],
  "Private (screened)": ["screened", "courtyard", "buffered"],
  "Open / social": ["open", "social", "view", "flow"]
};

const indoorOutdoorKeywords: Record<IndoorOutdoor, string[]> = {
  "Outdoor-first": ["terrace", "pool", "breeze", "veranda"],
  Balanced: ["equal_flow", "transition", "veranda"],
  "Indoor-first": ["indoor", "calm", "sheltered"]
};

const staffingKeywords: Record<Staffing, string[]> = {
  "None (owner-managed)": ["owner_operated", "compact"],
  "Day staff (light)": ["discreet_service", "storage", "service"],
  "Full day staff (daily + cook)": [
    "service",
    "back_of_house",
    "discreet_service"
  ],
  "Live-in staff (staff wing)": [
    "service_wing",
    "separation",
    "back_of_house"
  ]
};

const bohKeywords: Record<BohSeparation, string[]> = {
  "Minimal (utility only)": ["compact", "back_of_house"],
  "Moderate (service route)": ["service_route", "separation"],
  "Full (service entry + yard + staff suite)": [
    "service_wing",
    "separation",
    "back_of_house"
  ]
};

const stairsKeywords: Record<Stairs, string[]> = {
  "Minimal steps (accessibility)": ["step_free", "accessible", "level"],
  "Some stairs OK": ["steps_ok", "terraced"],
  "Split-level OK (views first)": ["split_level", "views"]
};

const whoStaysKeywords: Record<WhoStays, string[]> = {
  "Couple / solo": ["couple"],
  "Small family (1–2 kids)": ["family"],
  "Large family (3+ kids)": ["family", "kids"],
  "Frequent guests": ["guests"],
  "Multi-generational": ["multi_gen", "family"]
};

const materialMoodKeywords: Record<MaterialMood, string[]> = {
  "Light + natural": ["light", "natural"],
  "Dark + grounding": ["dark", "grounded"],
  "Warm + earthy": ["warm", "earthy"],
  "Crisp + minimal": ["crisp", "minimal"]
};

const poolKeywords: Record<Pool, string[]> = {
  Plunge: ["plunge", "pool"],
  Standard: ["pool"],
  Large: ["pool", "lap"],
  "No pool": ["no_pool"]
};

const parkingKeywords: Record<Parking, string[]> = {
  "1–2 cars": ["parking"],
  "2–3 cars": ["parking"],
  "3+ cars": ["parking", "expanded"]
};

const flexKeywords: Record<FlexSpace, string[]> = {
  Office: ["office", "work"],
  Media: ["media", "lounge"],
  "Gym/Wellness": ["wellness", "gym"],
  "Kids play": ["kids", "play"],
  "Guest flex": ["guest", "flex"],
  Studio: ["studio", "creative"]
};

const hashString = (value: string) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createRng = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
};

const pickPrimaryStyle = (payload: GenerateRequest): Style => {
  if (payload.style && payload.style.length > 0) {
    return payload.style[0];
  }
  if (payload.privacy === "Very private (secluded)") {
    return "Resort Minimal";
  }
  if (payload.indoorOutdoor === "Indoor-first") {
    return "Contemporary Thai";
  }
  return "Tropical Modern";
};

const buildLibraryTiles = (payload: GenerateRequest): MoodboardTile[] => {
  const style = pickPrimaryStyle(payload);
  const styleSlug = STYLE_SLUGS[style] ?? STYLE_SLUGS["Tropical Modern"];

  return TILE_LIBRARY_BASE.map((tile) => {
    const sectionSlug = SECTION_ASSET_SLUGS[tile.section];
    const src = `/moodboard/${styleSlug}/${sectionSlug}/${tile.assetId}.jpg`;
    return {
      id: tile.id,
      section: tile.section,
      kind: tile.kind,
      title: tile.title,
      tags: tile.tags,
      captionTokens: tile.captionTokens,
      image: {
        type: "local",
        src,
        alt: tile.title
      }
    };
  });
};

const toToken = (value: string) => value.trim().toLowerCase();

const buildKeywordSets = (payload: GenerateRequest) => {
  const primaryStyle = pickPrimaryStyle(payload);
  const required = new Set<string>([
    ...styleKeywords[primaryStyle],
    ...privacyKeywords[payload.privacy],
    ...indoorOutdoorKeywords[payload.indoorOutdoor],
    ...staffingKeywords[payload.staffing],
    ...bohKeywords[payload.boh],
    ...stairsKeywords[payload.stairs]
  ]);

  const optional = new Set<string>();
  const secondaryStyle = payload.style && payload.style.length > 1
    ? payload.style[1]
    : null;

  if (secondaryStyle) {
    styleKeywords[secondaryStyle].forEach((keyword) => optional.add(keyword));
  }

  if (payload.whoStays) {
    whoStaysKeywords[payload.whoStays].forEach((keyword) => optional.add(keyword));
  }

  payload.materialMood?.forEach((mood) => {
    materialMoodKeywords[mood].forEach((keyword) => optional.add(keyword));
  });

  if (payload.pool) {
    poolKeywords[payload.pool].forEach((keyword) => optional.add(keyword));
  }

  if (payload.parking) {
    parkingKeywords[payload.parking].forEach((keyword) => optional.add(keyword));
  }

  payload.flexSpaces?.forEach((space) => {
    flexKeywords[space].forEach((keyword) => optional.add(keyword));
  });

  return { required, optional };
};

const scoreTile = (
  tile: MoodboardTile,
  required: Set<string>,
  optional: Set<string>
) => {
  let score = 0;
  tile.tags.forEach((tag) => {
    if (required.has(tag)) score += 2;
    else if (optional.has(tag)) score += 1;
  });
  return score;
};

const formatCaption = (tile: MoodboardTile, payload: GenerateRequest) => {
  const tokens = tile.captionTokens.map(toToken);
  if (payload.privacy === "Very private (secluded)" && !tokens.includes("screened")) {
    if (tokens.length < 3) {
      tokens.push("screened");
    } else {
      tokens[tokens.length - 1] = "screened";
    }
  }
  if (payload.indoorOutdoor === "Outdoor-first" && !tokens.includes("breezy")) {
    if (tokens.length < 3) {
      tokens.push("breezy");
    }
  }
  return tokens.slice(0, 3).join(" | ");
};

const selectTilesForSection = (
  tiles: MoodboardTile[],
  required: Set<string>,
  optional: Set<string>,
  seed: number,
  sectionId: MoodboardSectionId
) => {
  const scored = tiles.map((tile) => ({
    tile,
    score: scoreTile(tile, required, optional),
    tie: hashString(`${seed}-${tile.id}`)
  }));

  const maxScore = Math.max(...scored.map((entry) => entry.score));

  if (maxScore === 0) {
    const defaults = new Set(DEFAULT_TILE_IDS[sectionId]);
    const candidates = scored
      .filter((entry) => defaults.has(entry.tile.id))
      .sort((a, b) => a.tie - b.tie)
      .map((entry) => entry.tile);

    if (candidates.length >= 3) {
      return candidates.slice(0, 3);
    }

    const fallback = scored
      .sort((a, b) => a.tie - b.tie)
      .map((entry) => entry.tile);

    return Array.from(new Set([...candidates, ...fallback])).slice(0, 3);
  }

  return scored
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.tie - b.tie;
    })
    .slice(0, 3)
    .map((entry) => entry.tile);
};

export const buildMoodboardTiles = (
  payload: GenerateRequest,
  moodSeed: number
): BuiltMoodboard => {
  const libraryTiles = buildLibraryTiles(payload);
  const { required, optional } = buildKeywordSets(payload);
  const seedBase =
    hashString(
      JSON.stringify({
        style: payload.style ?? [],
        privacy: payload.privacy,
        indoorOutdoor: payload.indoorOutdoor,
        staffing: payload.staffing,
        boh: payload.boh,
        stairs: payload.stairs,
        whoStays: payload.whoStays ?? null,
        materialMood: payload.materialMood ?? [],
        pool: payload.pool ?? null,
        parking: payload.parking ?? null,
        flexSpaces: payload.flexSpaces ?? []
      })
    ) ^
    (moodSeed * 2654435761);

  return {
    sections: SECTION_DEFS.map((section, index) => {
      const sectionTiles = libraryTiles.filter(
        (tile) => tile.section === section.id
      );
      const rng = createRng(seedBase + index * 977);
      const jitter = Math.floor(rng() * 1000);
      const selected = selectTilesForSection(
        sectionTiles,
        required,
        optional,
        seedBase + jitter,
        section.id
      );

      return {
        id: section.id,
        label: section.label,
        tiles: selected.map((tile) => ({
          id: tile.id,
          kind: tile.kind,
          title: tile.title,
          caption: formatCaption(tile, payload),
          src: tile.image.src,
          alt: tile.image.alt
        }))
      };
    })
  };
};
