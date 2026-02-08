export type PrimaryUse =
  | "Primary home (no rentals)"
  | "Primary + occasional rent"
  | "Holiday home (rent when away)"
  | "Investment rental"
  | "Long-stay rental (6–12 months)";

export type WhoStays =
  | "Couple / solo"
  | "Small family (1–2 kids)"
  | "Large family (3+ kids)"
  | "Frequent guests"
  | "Multi-generational";

export type Staffing =
  | "None (owner-managed)"
  | "Day staff (light)"
  | "Full day staff (daily + cook)"
  | "Live-in staff (staff wing)";

export type BohSeparation =
  | "Minimal (utility only)"
  | "Moderate (service route)"
  | "Full (service entry + yard + staff suite)";

export type Stairs =
  | "Minimal steps (accessibility)"
  | "Some stairs OK"
  | "Split-level OK (views first)";

export type Privacy = "Open / social" | "Private (screened)" | "Very private (secluded)";
export type IndoorOutdoor = "Outdoor-first" | "Balanced" | "Indoor-first";

export type Style =
  | "Tropical Modern"
  | "Contemporary Thai"
  | "Resort Minimal"
  | "Rustic Minimal"
  | "Mid-century tropical"
  | "Eco-modern";

export type MaterialMood =
  | "Light + natural"
  | "Dark + grounding"
  | "Warm + earthy"
  | "Crisp + minimal";

export type Pool = "Plunge" | "Standard" | "Large" | "No pool";
export type Parking = "1–2 cars" | "2–3 cars" | "3+ cars";
export type FlexSpace =
  | "Office"
  | "Media"
  | "Gym/Wellness"
  | "Kids play"
  | "Guest flex"
  | "Studio";

export type GenerateRequest = {
  bedrooms: number;
  primaryUse: PrimaryUse;
  staffing: Staffing;
  boh: BohSeparation;
  stairs: Stairs;
  privacy: Privacy;
  indoorOutdoor: IndoorOutdoor;
  values: string[];
  narrativeSeed?: number;
  notes?: string;
  whoStays?: WhoStays;
  style?: Style[];
  materialMood?: MaterialMood[];
  pool?: Pool;
  parking?: Parking;
  flexSpaces?: FlexSpace[];
};

export type ProgramItem = {
  space: string;
  qty: number;
  area_m2: number;
  notes?: string;
};

export type PlanArea = {
  label: string;
  area_m2: number;
};

export type PlanOption = {
  svg: string;
  notes: string[];
  areas: PlanArea[];
};

export type MoodboardTile = {
  imageUrl: string;
  caption: string;
  query: string;
};

export type GenerateResponse = {
  brief_md: string;
  program: ProgramItem[];
  plans: {
    optionA: PlanOption;
    optionB: PlanOption;
  };
  values: string[];
  narrative?: string;
  notes?: string;
  moodboard: {
    palette: string[];
    materials: string[];
    tiles: MoodboardTile[];
  };
};
