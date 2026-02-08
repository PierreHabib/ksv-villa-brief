import {
  STYLE_GENRES,
  materialSections,
  paletteOrder,
  type Finish,
  type MaterialsSectionKey,
  type StyleGenreEntry
} from "./finishesLibrary";

type FinishTone = "CORE" | "ACCENT";

type FinishWithTone = Finish & {
  tone: FinishTone;
};

const STYLE_GENRE_MAP = Object.fromEntries(
  STYLE_GENRES.map((genre) => [genre.name, genre])
) as Record<string, StyleGenreEntry>;

const hashStringToInt = (value: string) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const pickDeterministic = <T,>(list: T[], count: number, seed: number) => {
  if (count <= 0 || list.length === 0) return [];
  const rng = mulberry32(seed);
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next.slice(0, Math.min(count, next.length));
};

const sectionKeyMap: Record<
  MaterialsSectionKey,
  keyof StyleGenreEntry["recommendedFinishes"]
> = {
  wallsCeilings: "walls",
  floorsStone: "floors",
  timberJoinery: "timber",
  metalsTextilesScreens: "metalsTextilesScreens"
};

const pickFinishesForSection = (
  candidates: FinishWithTone[],
  seed: number
) => {
  const used = new Set<string>();
  const picks: FinishWithTone[] = [];

  const addPicks = (list: FinishWithTone[], count: number, offset: number) => {
    const available = list.filter((item) => !used.has(item.id));
    const picked = pickDeterministic(available, count, seed + offset);
    picked.forEach((item) => {
      used.add(item.id);
      picks.push(item);
    });
  };

  const core = candidates.filter((item) => item.tone === "CORE");
  const primary = candidates.filter((item) => item.tier === "primary");
  const coreNeeded = Math.min(2, core.length);
  const primaryNeeded = Math.min(2, primary.length);

  addPicks(
    core.filter((item) => item.tier === "primary"),
    coreNeeded,
    11
  );
  if (picks.length < coreNeeded) {
    addPicks(
      core.filter((item) => item.tier === "supporting"),
      coreNeeded - picks.length,
      19
    );
  }

  const currentPrimary = picks.filter((item) => item.tier === "primary").length;
  if (currentPrimary < primaryNeeded) {
    addPicks(primary, primaryNeeded - currentPrimary, 27);
  }

  addPicks(candidates, 4 - picks.length, 37);

  return picks.slice(0, 4);
};

export const buildFinishesBoard = (selectedGenres: string[], moodSeed: number) => {
  const entries = selectedGenres
    .map((name) => STYLE_GENRE_MAP[name])
    .filter(Boolean);
  if (entries.length === 0) return null;

  const genreKey = selectedGenres.join("|");
  const sections = materialSections.map((section) => {
    const sourceKey = sectionKeyMap[section.key];
    const bucket = new Map<string, { finish: Finish; count: number }>();

    entries.forEach((entry) => {
      entry.recommendedFinishes[sourceKey].forEach((finish) => {
        const existing = bucket.get(finish.id);
        if (existing) {
          existing.count += 1;
        } else {
          bucket.set(finish.id, { finish, count: 1 });
        }
      });
    });

    const candidates: FinishWithTone[] = Array.from(bucket.values()).map(
      ({ finish, count }) => ({
        ...finish,
        tone: count >= 2 ? "CORE" : "ACCENT"
      })
    );

    const seed = hashStringToInt(`${moodSeed}-${section.key}-${genreKey}`);
    const picks = pickFinishesForSection(candidates, seed);

    return { key: section.key, label: section.label, picks };
  });

  return {
    sections,
    allFinishes: sections.flatMap((section) => section.picks)
  };
};

export const buildPalette = (selectedGenres: string[]) => {
  const entries = selectedGenres
    .map((name) => STYLE_GENRE_MAP[name])
    .filter(Boolean);
  if (entries.length === 0) return [];
  const genreKey = selectedGenres.join("|");

  return paletteOrder.map((role) => {
    const values = entries.flatMap((entry) => entry.paletteRoles[role.key]);
    const unique = Array.from(new Set(values));
    const picked =
      pickDeterministic(
        unique,
        1,
        hashStringToInt(`${genreKey}-${role.key}`)
      )[0] ?? "#D9D0C2";
    return { label: role.label, color: picked };
  });
};

const formatTag = (tag: string) =>
  tag
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const buildThemeChips = (finishes: FinishWithTone[]) => {
  const counts = new Map<string, number>();
  finishes.forEach((finish) => {
    finish.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });
  const sorted = [...counts.entries()].sort((a, b) => {
    const diff = b[1] - a[1];
    if (diff !== 0) return diff;
    return hashStringToInt(a[0]) - hashStringToInt(b[0]);
  });
  return sorted.slice(0, 6).map(([tag]) => formatTag(tag));
};
