"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  FlexSpace,
  GenerateRequest,
  GenerateResponse,
  MaterialMood,
  Parking,
  Pool,
  Style
} from "@/lib/types";
import { getProgramAreaRange } from "@/lib/program";
import {
  buildFinishesBoard,
  buildPalette,
  buildThemeChips
} from "@/lib/finishesEngine";

const steps = ["Intake", "Brief + Program", "Plans", "Materials & Finishes"];

type Draft = Partial<GenerateRequest> & {
  experienceZone?: string;
  plotSize?: string;
};

type Option<T> = {
  label: string;
  value: T;
  hint?: string;
};

type SingleQuestion<T> = {
  id: keyof Draft;
  title: string;
  subtitle: string;
  options: Option<T>[];
  columns?: number;
  required?: boolean;
};

const questions: SingleQuestion<any>[] = [
  {
    id: "bedrooms",
    title: "Bedrooms",
    subtitle: "How many suites should the villa include?",
    required: true,
    columns: 3,
    options: [
      { label: "1", value: 1, hint: "Couple / solo" },
      { label: "2", value: 2, hint: "Small family" },
      { label: "3", value: 3, hint: "Flexible hosting" },
      { label: "4", value: 4, hint: "Family + guests" },
      { label: "5", value: 5, hint: "Entertainer" },
      { label: "6", value: 6, hint: "Large gatherings" }
    ]
  },
  {
    id: "primaryUse",
    title: "Primary Use",
    subtitle: "How will the villa be used most often?",
    required: true,
    columns: 2,
    options: [
      { label: "Primary home (no rentals)", value: "Primary home (no rentals)" },
      { label: "Primary + occasional rent", value: "Primary + occasional rent" },
      {
        label: "Holiday home (rent when away)",
        value: "Holiday home (rent when away)"
      },
      { label: "Investment rental", value: "Investment rental" },
      {
        label: "Long-stay rental (6–12 months)",
        value: "Long-stay rental (6–12 months)"
      }
    ]
  },
  {
    id: "whoStays",
    title: "Who stays?",
    subtitle: "Recommended for suite sizing.",
    required: true,
    columns: 2,
    options: [
      { label: "Couple / solo", value: "Couple / solo" },
      { label: "Small family (1–2 kids)", value: "Small family (1–2 kids)" },
      { label: "Large family (3+ kids)", value: "Large family (3+ kids)" },
      { label: "Frequent guests", value: "Frequent guests" },
      { label: "Multi-generational", value: "Multi-generational" }
    ]
  },
  {
    id: "staffing",
    title: "Staff & Service",
    subtitle: "Staffing model and daily support.",
    required: true,
    columns: 2,
    options: [
      { label: "None (owner-managed)", value: "None (owner-managed)" },
      { label: "Day staff (light)", value: "Day staff (light)" },
      { label: "Full day staff (daily + cook)", value: "Full day staff (daily + cook)" },
      { label: "Live-in staff (staff wing)", value: "Live-in staff (staff wing)" }
    ]
  },
  {
    id: "boh",
    title: "Back-of-house separation",
    subtitle: "How separated should service flow feel?",
    required: true,
    columns: 2,
    options: [
      { label: "Minimal (utility only)", value: "Minimal (utility only)" },
      { label: "Moderate (service route)", value: "Moderate (service route)" },
      {
        label: "Full (service entry + yard + staff suite)",
        value: "Full (service entry + yard + staff suite)"
      }
    ]
  },
  {
    id: "stairs",
    title: "Stairs tolerance",
    subtitle: "Comfort with level changes.",
    required: true,
    columns: 2,
    options: [
      { label: "Minimal steps (accessibility)", value: "Minimal steps (accessibility)" },
      { label: "Some stairs OK", value: "Some stairs OK" },
      { label: "Split-level OK (views first)", value: "Split-level OK (views first)" }
    ]
  },
  {
    id: "privacy",
    title: "Privacy level",
    subtitle: "How sheltered should the experience feel?",
    required: true,
    columns: 2,
    options: [
      { label: "Open / social", value: "Open / social" },
      { label: "Private (screened)", value: "Private (screened)" },
      { label: "Very private (secluded)", value: "Very private (secluded)" }
    ]
  },
  {
    id: "indoorOutdoor",
    title: "Indoor–Outdoor emphasis",
    subtitle: "Where should daily life gravitate?",
    required: true,
    columns: 3,
    options: [
      { label: "Outdoor-first", value: "Outdoor-first" },
      { label: "Balanced", value: "Balanced" },
      { label: "Indoor-first", value: "Indoor-first" }
    ]
  },
  {
    id: "experienceZone",
    title: "Preferred experience zone",
    subtitle: "Which area of the valley should this villa feel most connected to?",
    required: true,
    columns: 2,
    options: [
      {
        label: "Sky Ridge",
        value: "Sky Ridge",
        hint: "Elevated ridge living (views + separation)"
      },
      {
        label: "Mountain Terrace",
        value: "Mountain Terrace",
        hint: "Elevated private retreat (quiet + framed views)"
      },
      {
        label: "Sanctuary Grove — Upstream",
        value: "Sanctuary Grove — Upstream",
        hint: "At the source of the ravine (anchored + elemental)"
      },
      {
        label: "Sanctuary Grove — Midstream",
        value: "Sanctuary Grove — Midstream",
        hint: "Connected, expressive living (close to spine + shared paths)"
      },
      {
        label: "Sanctuary Residence — Downstream",
        value: "Sanctuary Residence — Downstream",
        hint: "Shared living within the grove (connection + ease)"
      },
      {
        label: "River Valley",
        value: "River Valley",
        hint: "Youthful riverside ease (light + accessible)"
      },
      {
        label: "Not sure / Advise me",
        value: "Not sure / Advise me",
        hint: "We’ll recommend based on the brief"
      }
    ]
  },
  {
    id: "plotSize",
    title: "Desired land plot size",
    subtitle: "Your comfort range for plot area (sqm).",
    required: true,
    columns: 2,
    options: [
      { label: "<400 sqm", value: "<400 sqm" },
      { label: "400–600 sqm", value: "400–600 sqm" },
      { label: "600–800 sqm", value: "600–800 sqm" },
      { label: ">800 sqm", value: ">800 sqm" }
    ]
  }
];

const styleGenreOptions = [
  {
    label: "Japanese / Zen (Japandi)",
    value: "Japanese / Zen (Japandi)",
    hint: "calm, natural, restrained"
  },
  {
    label: "Modern Tropical (Tropical Modernism)",
    value: "Modern Tropical (Tropical Modernism)",
    hint: "clean lines, breezy, shaded"
  },
  {
    label: "Balinese Resort",
    value: "Balinese Resort",
    hint: "crafted, layered, indoor–outdoor"
  },
  {
    label: "Thai Contemporary",
    value: "Thai Contemporary",
    hint: "Thai cues, modern detailing"
  },
  {
    label: "Traditional Thai",
    value: "Traditional Thai",
    hint: "ornate, timber, pitched roofs"
  },
  {
    label: "Mediterranean Coastal",
    value: "Mediterranean Coastal",
    hint: "sun-washed, plaster, stone"
  },
  {
    label: "Scandinavian Minimal",
    value: "Scandinavian Minimal",
    hint: "light, warm minimal, functional"
  },
  {
    label: "Rustic Natural",
    value: "Rustic Natural",
    hint: "textured, earthy, handcrafted"
  },
  {
    label: "Boho Eclectic",
    value: "Boho Eclectic",
    hint: "mixed materials, collected, expressive"
  },
  {
    label: "Industrial Modern",
    value: "Industrial Modern",
    hint: "raw, metal, concrete, bold"
  },
  {
    label: "Mid-century Modern",
    value: "Mid-century Modern",
    hint: "retro proportions, timber, graphic"
  },
  {
    label: "Contemporary Luxury",
    value: "Contemporary Luxury",
    hint: "clean, refined, hotel-grade"
  }
];

const materialMoodOptions: MaterialMood[] = [
  "Light + natural",
  "Dark + grounding",
  "Warm + earthy",
  "Crisp + minimal"
];

const poolOptions: Pool[] = ["Plunge", "Standard", "Large", "No pool"];
const parkingOptions: Parking[] = ["1–2 cars", "2–3 cars", "3+ cars"];
const flexSpaceOptions: FlexSpace[] = [
  "Office",
  "Media",
  "Gym/Wellness",
  "Kids play",
  "Guest flex",
  "Studio"
];
const valuesOptions = [
  "Work-life balance and personal fulfilment",
  "Music and dancing",
  "Nature exploration and adventures",
  "Lifelong learning and personal growth",
  "Nutritional eating & healthy living",
  "Mind-body practices and nature-based spirituality",
  "Festivals, events and cultural celebrations",
  "Child and youth development",
  "Social gatherings and community events",
  "Diverse and global culinary experiences",
  "Plant-based medicine",
  "Support creative arts and humanities",
  "Eco-village and sustainable living",
  "Regeneration of natural resources",
  "Psychedelic and alternative mental health therapy",
  "Personal boundaries and individual freedoms",
  "Integrative and functional medicine",
  "Entrepreneurship and innovation",
  "Hard work and dedication",
  "Alternative energy and sustainable transportation",
  "Intergenerational care and connections",
  "Traditional religious practices",
  "Gender diversity and LGBTQ+"
];

const emptyDraft: Draft = {
  bedrooms: undefined,
  primaryUse: undefined,
  whoStays: undefined,
  staffing: undefined,
  boh: undefined,
  stairs: undefined,
  privacy: undefined,
  indoorOutdoor: undefined,
  experienceZone: undefined,
  plotSize: undefined,
  values: undefined,
  notes: "",
  style: undefined,
  materialMood: undefined,
  pool: undefined,
  parking: undefined,
  flexSpaces: undefined
};

const isGenericTitle = (title: string) => {
  const lower = title.toLowerCase();
  return (
    lower.startsWith("primary") ||
    lower.includes("finish") ||
    lower.includes("screen material") ||
    lower.includes("soft goods") ||
    lower.includes("service floor")
  );
};

const getFitLabel = (finish: {
  tone?: string;
  tier?: string;
  tags?: string[];
}) => {
  if (finish.tone === "CORE" || finish.tags?.includes("CORE")) {
    return "Strong fit";
  }
  if (finish.tier === "primary" || finish.tier === "supporting") {
    return "Supporting";
  }
  return "Wildcard";
};

const sanitizeName = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^A-Za-z0-9_-]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

const makeSubmissionId = () => {
  const now = new Date();
  const pad = (num: number) => String(num).padStart(2, "0");
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const d = pad(now.getDate());
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let rand = "";
  for (let i = 0; i < 4; i += 1) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  return `KSV-${y}${m}${d}-${hh}${mm}-${rand}`;
};

const downloadJson = (filename: string, obj: unknown) => {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

const csvEscape = (value: string) => {
  const normalized = value ?? "";
  const escaped = normalized.replace(/"/g, "\"\"");
  if (/[",\n]/.test(escaped)) {
    return `"${escaped}"`;
  }
  return escaped;
};

const buildCsv = (headers: string[], rows: (string | number | null | undefined)[][]) => {
  const headerLine = headers.map((header) => csvEscape(String(header))).join(",");
  const bodyLines = rows.map((row) =>
    row.map((cell) => csvEscape(cell === null || cell === undefined ? "" : String(cell))).join(",")
  );
  return [headerLine, ...bodyLines].join("\n");
};

const downloadCsv = (filename: string, csvText: string) => {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const safeString = (value: unknown) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
};

const mapGenreToBackendStyle = (genre: string): Style => {
  switch (genre) {
    case "Japanese / Zen (Japandi)":
      return "Resort Minimal";
    case "Modern Tropical (Tropical Modernism)":
      return "Tropical Modern";
    case "Balinese Resort":
      return "Resort Minimal";
    case "Thai Contemporary":
      return "Contemporary Thai";
    case "Traditional Thai":
      return "Contemporary Thai";
    case "Mediterranean Coastal":
      return "Rustic Minimal";
    case "Scandinavian Minimal":
      return "Eco-modern";
    case "Rustic Natural":
      return "Rustic Minimal";
    case "Boho Eclectic":
      return "Rustic Minimal";
    case "Industrial Modern":
      return "Resort Minimal";
    case "Mid-century Modern":
      return "Mid-century tropical";
    case "Contemporary Luxury":
      return "Resort Minimal";
    default:
      return "Tropical Modern";
  }
};
function formatArea(area: number) {
  return `${Math.round(area)} m²`;
}

function inlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-clay-700">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function MarkdownBlock({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={`list-${key}`} className="ml-5 list-disc space-y-2 text-sm">
        {listBuffer.map((item, index) => (
          <li key={`li-${key}-${index}`}>{inlineMarkdown(item)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((line, index) => {
    if (line.trim() === "") {
      flushList(`${index}-blank`);
      return;
    }

    if (line.startsWith("- ")) {
      listBuffer.push(line.replace("- ", ""));
      return;
    }

    flushList(`${index}-before`);

    if (line.startsWith("### ")) {
      blocks.push(
        <h4
          key={`h3-${index}`}
          className="font-serif text-lg text-clay-700"
        >
          {line.replace("### ", "")}
        </h4>
      );
      return;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h3
          key={`h2-${index}`}
          className="font-serif text-xl text-clay-800"
        >
          {line.replace("## ", "")}
        </h3>
      );
      return;
    }

    if (line.startsWith("# ")) {
      blocks.push(
        <h2
          key={`h1-${index}`}
          className="font-serif text-2xl text-clay-900"
        >
          {line.replace("# ", "")}
        </h2>
      );
      return;
    }

    blocks.push(
      <p key={`p-${index}`} className="text-sm leading-relaxed">
        {inlineMarkdown(line)}
      </p>
    );
  });

  flushList("final");

  return <div className="space-y-3">{blocks}</div>;
}

type Toast = { id: number; message: string };

function ToastStack({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-2xl border border-sand-200 bg-white/90 px-4 py-3 text-sm text-clay-900 shadow-soft backdrop-blur"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inlineMarkdownHtml(text: string) {
  const escaped = escapeHtml(text);
  return escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function markdownToHtml(markdown: string) {
  const lines = markdown.split("\n");
  let html = "";
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html += "</ul>";
      listOpen = false;
    }
  };

  lines.forEach((line) => {
    if (line.trim() === "") {
      closeList();
      return;
    }

    if (line.startsWith("- ")) {
      if (!listOpen) {
        html += "<ul>";
        listOpen = true;
      }
      html += `<li>${inlineMarkdownHtml(line.slice(2))}</li>`;
      return;
    }

    closeList();

    if (line.startsWith("### ")) {
      html += `<h4>${inlineMarkdownHtml(line.slice(4))}</h4>`;
      return;
    }
    if (line.startsWith("## ")) {
      html += `<h3>${inlineMarkdownHtml(line.slice(3))}</h3>`;
      return;
    }
    if (line.startsWith("# ")) {
      html += `<h2>${inlineMarkdownHtml(line.slice(2))}</h2>`;
      return;
    }

    html += `<p>${inlineMarkdownHtml(line)}</p>`;
  });

  closeList();
  return html;
}

function markdownToPlainText(markdown: string) {
  return markdown
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\r\n/g, "\n")
    .trim();
}

type BriefSnapshotItem = {
  label: string;
  value: string;
};

type BriefSections = {
  snapshot: BriefSnapshotItem[];
  designIntent: string;
  spatialPriorities: string[];
  architecturalMood: string;
};

function extractBriefSection(markdown: string, heading: string) {
  const pattern = new RegExp(`##\\s+${heading}\\n([\\s\\S]*?)(?=\\n##\\s+|$)`, "i");
  const match = markdown.match(pattern);
  return match?.[1]?.trim() ?? "";
}

function parseBriefSections(markdown: string): BriefSections {
  const snapshotSection = extractBriefSection(markdown, "Project Snapshot");
  const designIntent = extractBriefSection(markdown, "Design Intent")
    .replace(/\n+/g, " ")
    .trim();
  const spatialSection = extractBriefSection(markdown, "Spatial Priorities");
  const architecturalMood = extractBriefSection(markdown, "Architectural Mood")
    .replace(/\n+/g, " ")
    .trim();

  const snapshot = snapshotSection
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/-\\s*\\*\\*(.+?)\\*\\*:\\s*(.+)/);
      if (!match) return null;
      return { label: match[1], value: match[2] };
    })
    .filter(Boolean) as BriefSnapshotItem[];

  const spatialPriorities = spatialSection
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^-\\s+/, "").trim())
    .filter(Boolean);

  return {
    snapshot,
    designIntent,
    spatialPriorities,
    architecturalMood
  };
}

export default function HomePage() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [mode, setMode] = useState<"wizard" | "loading" | "results">(
    "wizard"
  );
  const [stageIndex, setStageIndex] = useState(0);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);
  const [moodSeed, setMoodSeed] = useState(0);
  const [narrativeSeed, setNarrativeSeed] = useState(0);
  const [isNarrativeLoading, setIsNarrativeLoading] = useState(false);
  const [respondentName, setRespondentName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmissionId, setLastSubmissionId] = useState<string | null>(null);
  const [lastSubmittedAt, setLastSubmittedAt] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const lastResultKeyRef = useRef<string | null>(null);
  const [resultsTab, setResultsTab] = useState<
    "overview" | "architect" | "finishes"
  >("overview");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [styleGenres, setStyleGenres] = useState<string[]>([]);
  const [styleLimitHint, setStyleLimitHint] = useState(false);

  const questionConfig = useMemo(
    () => [
      {
        key: "bedrooms",
        label: "Bedrooms",
        anchorId: "q-bedrooms",
        isAnswered: () => draft.bedrooms !== undefined
      },
      {
        key: "primaryUse",
        label: "Primary Use",
        anchorId: "q-primaryUse",
        isAnswered: () => draft.primaryUse !== undefined
      },
      {
        key: "whoStays",
        label: "Who stays",
        anchorId: "q-whoStays",
        isAnswered: () => draft.whoStays !== undefined
      },
      {
        key: "staffing",
        label: "Staff & Service",
        anchorId: "q-staffing",
        isAnswered: () => draft.staffing !== undefined
      },
      {
        key: "boh",
        label: "Back-of-house separation",
        anchorId: "q-boh",
        isAnswered: () => draft.boh !== undefined
      },
      {
        key: "stairs",
        label: "Stairs tolerance",
        anchorId: "q-stairs",
        isAnswered: () => draft.stairs !== undefined
      },
      {
        key: "privacy",
        label: "Privacy level",
        anchorId: "q-privacy",
        isAnswered: () => draft.privacy !== undefined
      },
      {
        key: "indoorOutdoor",
        label: "Indoor–Outdoor emphasis",
        anchorId: "q-indoorOutdoor",
        isAnswered: () => draft.indoorOutdoor !== undefined
      },
      {
        key: "experienceZone",
        label: "Preferred experience zone",
        anchorId: "q-experienceZone",
        isAnswered: () => draft.experienceZone !== undefined
      },
      {
        key: "plotSize",
        label: "Desired land plot size",
        anchorId: "q-plotSize",
        isAnswered: () => draft.plotSize !== undefined
      },
      {
        key: "values",
        label: "Values & Culture",
        anchorId: "q-values",
        isAnswered: () => (draft.values?.length ?? 0) > 0
      },
      {
        key: "style",
        label: "Style direction",
        anchorId: "q-style",
        isAnswered: () => styleGenres.length > 0
      },
      {
        key: "materialMood",
        label: "Material mood",
        anchorId: "q-materialMood",
        isAnswered: () => (draft.materialMood?.length ?? 0) > 0
      },
      {
        key: "pool",
        label: "Pool preference",
        anchorId: "q-pool",
        isAnswered: () => draft.pool !== undefined
      },
      {
        key: "parking",
        label: "Parking",
        anchorId: "q-parking",
        isAnswered: () => draft.parking !== undefined
      },
      {
        key: "flexSpaces",
        label: "Flex spaces",
        anchorId: "q-flexSpaces",
        isAnswered: () => (draft.flexSpaces?.length ?? 0) > 0
      }
    ],
    [
      draft.bedrooms,
      draft.primaryUse,
      draft.whoStays,
      draft.staffing,
      draft.boh,
      draft.stairs,
      draft.privacy,
      draft.indoorOutdoor,
      draft.experienceZone,
      draft.plotSize,
      draft.values,
      draft.style,
      styleGenres,
      draft.materialMood,
      draft.pool,
      draft.parking,
      draft.flexSpaces
    ]
  );

  const answeredCount = useMemo(
    () => questionConfig.filter((question) => question.isAnswered()).length,
    [questionConfig]
  );

  const totalCount = questionConfig.length;
  const remainingCount = Math.max(0, totalCount - answeredCount);
  const isFormComplete = remainingCount === 0;
  const progressPercent =
    totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  const firstUnansweredAnchorId = useMemo(() => {
    const first = questionConfig.find((question) => !question.isAnswered());
    return first?.anchorId ?? null;
  }, [questionConfig]);

  const payload = useMemo(() => {
    if (!isFormComplete) return null;
    const { experienceZone, plotSize, ...draftPayload } = draft;
    const primaryGenre = styleGenres[0];
    const mappedStyle = primaryGenre
      ? mapGenreToBackendStyle(primaryGenre)
      : undefined;
    const trimmedNotes = draft.notes?.trim();
    return {
      ...draftPayload,
      style: mappedStyle ? [mappedStyle] : undefined,
      notes: trimmedNotes ? trimmedNotes : undefined
    } as GenerateRequest;
  }, [draft, isFormComplete, styleGenres]);

  const areaRangeLabel = useMemo(() => {
    if (!payload) return "—";
    const range = getProgramAreaRange(payload.bedrooms);
    return `~${range.min}–${range.max} m²`;
  }, [payload]);

  const styleLabel = useMemo(() => {
    if (!payload) return "—";
    if (payload.style && payload.style.length) {
      return payload.style.join(", ");
    }
    return "Auto";
  }, [payload]);

  const valuesCount = draft.values?.length ?? 0;
  const valuesList = result?.values ?? draft.values ?? [];
  const notesValue = draft.notes ?? "";
  const notesCount = notesValue.length;
  const notesText = (result?.notes ?? payload?.notes ?? "").trim();
  const preparedForName = respondentName.trim();

  const finishesBoard = useMemo(() => {
    return buildFinishesBoard(styleGenres, moodSeed);
  }, [styleGenres, moodSeed]);

  const briefSections = useMemo(() => {
    if (!result?.brief_md) {
      return {
        snapshot: [],
        designIntent: "",
        spatialPriorities: [],
        architecturalMood: ""
      } as BriefSections;
    }
    return parseBriefSections(result.brief_md);
  }, [result?.brief_md]);

  const spatialGroups = useMemo(() => {
    const groups = {
      arrival: [] as string[],
      social: [] as string[],
      privateWing: [] as string[],
      service: [] as string[]
    };
    briefSections.spatialPriorities.forEach((item) => {
      const lower = item.toLowerCase();
      if (/(arrival|entry|foyer|drop-off)/.test(lower)) {
        groups.arrival.push(item);
      } else if (/(suite|bedroom|guest)/.test(lower)) {
        groups.privateWing.push(item);
      } else if (/(staff|service|boh|back-of-house|laundry|utility|storage)/.test(lower)) {
        groups.service.push(item);
      } else {
        groups.social.push(item);
      }
    });
    return groups;
  }, [briefSections.spatialPriorities]);

  const moodKeywords = useMemo(() => {
    const text = briefSections.architecturalMood.toLowerCase();
    if (text.includes("layered") || text.includes("tropical")) {
      return ["Calm", "breezy", "layered"];
    }
    return ["Calm", "breezy", "grounded"];
  }, [briefSections.architecturalMood]);

  const paletteSwatches = useMemo(() => {
    return buildPalette(styleGenres);
  }, [styleGenres]);

  const themeChips = useMemo(() => {
    return buildThemeChips(finishesBoard?.allFinishes ?? []);
  }, [finishesBoard]);

  const designIntentBullets = useMemo(() => {
    const text = briefSections.designIntent?.trim();
    if (!text) {
      return [
        "Design intent will be refined with the architect based on site specifics."
      ];
    }
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
    return (sentences.length ? sentences : [text]).slice(0, 3);
  }, [briefSections.designIntent]);

  const materialSpecs = useMemo(() => {
    const fallback = {
      walls: [
        "Breathable mineral plaster walls with a matte finish",
        "Low-sheen limewash for primary living zones",
        "Moisture-tolerant paint in utility areas"
      ],
      floors: [
        "Textured limestone or ceramic with slip resistance",
        "Outdoor pavers with bush-hammered or flamed finish",
        "Engineered timber for bedroom comfort"
      ],
      timber: [
        "Teak or oak joinery with sealed, low-gloss finish",
        "Durable veneer for built-ins",
        "Ventilated timber soffits for shade"
      ],
      screens: [
        "Timber or rattan screens for filtered privacy",
        "Deep eaves with shading battens",
        "Adjustable louvers for airflow"
      ],
      metals: [
        "Brushed brass or bronze hardware",
        "Marine-grade stainless in wet zones",
        "Matte black accents used sparingly"
      ]
    };

    if (!finishesBoard) {
      if (styleGenres.includes("Scandinavian Minimal")) {
        return {
          ...fallback,
          walls: [
            "Cool limewash walls with subtle texture",
            "Clean mineral paint in wet zones",
            "Low-gloss white ceilings"
          ],
          timber: [
            "Pale oak or ash joinery",
            "Light veneer panels for warmth",
            "Soft-edge timber detailing"
          ],
          metals: [
            "Brushed steel hardware",
            "Cool nickel fixtures",
            "Matte graphite accents"
          ]
        };
      }
      if (styleGenres.includes("Industrial Modern")) {
        return {
          ...fallback,
          walls: [
            "Microcement walls with a cool grey tone",
            "Raw concrete feature planes",
            "Durable matte paint in service zones"
          ],
          floors: [
            "Polished concrete or terrazzo flooring",
            "Basalt or dark stone outdoors",
            "Slip-safe service flooring"
          ],
          metals: [
            "Blackened steel details",
            "Graphite hardware",
            "Brushed stainless in wet areas"
          ]
        };
      }
      if (styleGenres.includes("Mediterranean Coastal")) {
        return {
          ...fallback,
          walls: [
            "Sun-washed lime plaster walls",
            "Soft white mineral paint in interiors",
            "Textured feature plaster in entries"
          ],
          floors: [
            "Terracotta or warm stone tiles",
            "Light limestone for terraces",
            "Textured outdoor tiles"
          ],
          metals: [
            "Warm bronze hardware",
            "Soft brass accents",
            "Avoid shiny chrome"
          ]
        };
      }
      return fallback;
    }

    const sectionMap = Object.fromEntries(
      finishesBoard.sections.map((section) => [section.key, section])
    );
    const toSpecs = (key: string, max: number) =>
      sectionMap[key]?.picks
        .slice(0, max)
        .map((finish) => `${finish.finish} for ${finish.where}`) ?? [];

    const metalsPicks = sectionMap["metalsTextilesScreens"]?.picks ?? [];
    const screenSpecs = metalsPicks
      .filter(
        (finish) =>
          finish.title.toLowerCase().includes("screen") ||
          finish.finish.toLowerCase().includes("screen") ||
          finish.tags?.some((tag) => tag.includes("screen"))
      )
      .map((finish) => `${finish.finish} for ${finish.where}`);
    const metalSpecs = metalsPicks
      .filter(
        (finish) =>
          finish.title.toLowerCase().includes("steel") ||
          finish.title.toLowerCase().includes("brass") ||
          finish.title.toLowerCase().includes("bronze") ||
          finish.finish.toLowerCase().includes("steel") ||
          finish.finish.toLowerCase().includes("brass") ||
          finish.finish.toLowerCase().includes("bronze")
      )
      .map((finish) => `${finish.finish} for ${finish.where}`);

    return {
      walls: toSpecs("wallsCeilings", 5).slice(0, 5).length
        ? toSpecs("wallsCeilings", 5)
        : fallback.walls,
      floors: toSpecs("floorsStone", 5).slice(0, 5).length
        ? toSpecs("floorsStone", 5)
        : fallback.floors,
      timber: toSpecs("timberJoinery", 5).slice(0, 5).length
        ? toSpecs("timberJoinery", 5)
        : fallback.timber,
      screens: screenSpecs.length
        ? screenSpecs.slice(0, 5)
        : fallback.screens,
      metals: metalSpecs.length
        ? metalSpecs.slice(0, 5)
        : fallback.metals
    };
  }, [finishesBoard, styleGenres]);


  const likelyConcept = useMemo(() => {
    if (!draft.privacy || !draft.indoorOutdoor || !draft.stairs || !draft.boh) {
      return "—";
    }
    const privacyText =
      draft.privacy === "Very private (secluded)"
        ? "Secluded"
        : draft.privacy === "Private (screened)"
          ? "Private"
          : "Open";
    const indoorOutdoorText =
      draft.indoorOutdoor === "Outdoor-first"
        ? "outdoor-first villa"
        : draft.indoorOutdoor === "Indoor-first"
          ? "indoor-first villa"
          : "balanced indoor-outdoor villa";
    const stairsText =
      draft.stairs === "Minimal steps (accessibility)"
        ? "minimal steps"
        : draft.stairs === "Split-level OK (views first)"
          ? "split-level"
          : "some stairs";
    const bohText =
      draft.boh === "Full (service entry + yard + staff suite)"
        ? "full service separation"
        : draft.boh === "Moderate (service route)"
          ? "moderate service separation"
          : "minimal service separation";
    return `${privacyText} ${indoorOutdoorText} with ${bohText} and ${stairsText}.`;
  }, [draft.boh, draft.indoorOutdoor, draft.privacy, draft.stairs]);

  const handleSelect = (id: keyof Draft, value: Draft[keyof Draft]) => {
    setDraft((prev) => ({ ...prev, [id]: value }));
  };

  const toggleMultiSelect = (
    id: keyof Draft,
    value: string,
    max: number
  ) => {
    setDraft((prev) => {
      const existing = Array.isArray(prev[id]) ? [...(prev[id] as string[])] : [];
      const hasValue = existing.includes(value);
      if (hasValue) {
        const next = existing.filter((item) => item !== value);
        return { ...prev, [id]: next.length ? next : undefined };
      }
      if (existing.length >= max) {
        return prev;
      }
      return { ...prev, [id]: [...existing, value] };
    });
  };

  const toggleValues = (value: string) => {
    setDraft((prev) => {
      const existing = Array.isArray(prev.values)
        ? [...(prev.values as string[])]
        : [];
      const hasValue = existing.includes(value);
      if (hasValue) {
        const next = existing.filter((item) => item !== value);
        return { ...prev, values: next.length ? next : undefined };
      }
      if (existing.length >= 10) {
        pushToast("Max 10 values selected.");
        return prev;
      }
      return { ...prev, values: [...existing, value] };
    });
  };

  const handleNotesChange = (value: string) => {
    const sanitized = value.replace(/\r/g, "");
    const limited = sanitized.slice(0, 600);
    setDraft((prev) => ({ ...prev, notes: limited }));
  };

  const handleNotesBlur = () => {
    setDraft((prev) => ({
      ...prev,
      notes: (prev.notes ?? "").trim()
    }));
  };

  const handleNameChange = (value: string) => {
    setRespondentName(value);
  };

  const handleNameBlur = () => {
    setRespondentName((prev) => prev.trim());
  };

  const toggleStyleGenre = (value: string) => {
    setStyleGenres((prev) => {
      const hasValue = prev.includes(value);
      if (hasValue) {
        return prev.filter((item) => item !== value);
      }
      if (prev.length >= 3) {
        setStyleLimitHint(true);
        window.setTimeout(() => {
          setStyleLimitHint(false);
        }, 1600);
        return prev;
      }
      return [...prev, value];
    });
  };

  const pushToast = (message: string, durationMs = 2400) => {
    toastIdRef.current += 1;
    const id = toastIdRef.current;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, durationMs);
  };

  const scrollToFirstUnanswered = () => {
    if (!firstUnansweredAnchorId) return;
    const target = document.getElementById(firstUnansweredAnchorId);
    if (!target) return;
    setHighlightedId(firstUnansweredAnchorId);
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      setHighlightedId((prev) =>
        prev === firstUnansweredAnchorId ? null : prev
      );
    }, 1200);
  };

  const runStages = () => {
    setStageIndex(0);
    return new Promise<void>((resolve) => {
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setStageIndex(Math.min(current, steps.length - 1));
        if (current >= steps.length - 1) {
          clearInterval(interval);
          resolve();
        }
      }, 650);
    });
  };

  const handleSubmit = async () => {
    if (!isFormComplete || !payload) {
      scrollToFirstUnanswered();
      return;
    }
    setMoodSeed(0);
    setNarrativeSeed(0);
    setIsFinalizing(false);
    setIsComplete(false);
    setMode("loading");
    setError(null);
    setResult(null);

    const stagePromise = runStages();
    const requestPayload: GenerateRequest = { ...payload, narrativeSeed: 0 };

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        let message = "Unable to generate the concept design pack. Try again.";
        try {
          const errorPayload = (await response.json()) as {
            error?: string;
            details?: { field?: string; message?: string }[];
          };
          if (errorPayload?.error) {
            message = errorPayload.error;
            if (Array.isArray(errorPayload.details) && errorPayload.details.length) {
              const fields = errorPayload.details
                .map((detail) => detail.field)
                .filter(Boolean)
                .join(", ");
              if (fields) {
                message = `${message} Missing/invalid: ${fields}.`;
              }
            }
          }
        } catch {
          // Ignore JSON parsing errors for non-JSON error responses.
        }
        throw new Error(message);
      }

      const data = (await response.json()) as GenerateResponse;
      await stagePromise;
      setResult(data);
      setIsFinalizing(true);
      setIsComplete(true);
    } catch (err) {
      await stagePromise;
      setError(err instanceof Error ? err.message : "Generation failed.");
      setIsFinalizing(false);
      setIsComplete(false);
      setMode("wizard");
    }
  };

  useEffect(() => {
    if (!isComplete || mode !== "loading") return;
    const timer = window.setTimeout(() => {
      setMode("results");
      setIsFinalizing(false);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [isComplete, mode]);

  useEffect(() => {
    if (!result) return;
    const nextKey =
      (result as { submission_id?: string }).submission_id ??
      `${result.brief_md}|${result.program.length}|${result.plans.optionA.svg.length}|${result.plans.optionB.svg.length}`;
    if (nextKey && nextKey !== lastResultKeyRef.current) {
      setSubmitted(false);
      setIsSubmitting(false);
      setLastSubmissionId(null);
      setLastSubmittedAt(null);
      setHasUnsavedChanges(false);
      lastResultKeyRef.current = nextKey;
    }
  }, [result]);

  useEffect(() => {
    if (mode === "results") {
      setResultsTab("overview");
    }
  }, [mode, result]);

  useEffect(() => {
    if (!isShareOpen) return;
    const closeMenu = () => setIsShareOpen(false);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [isShareOpen]);

  const reset = () => {
    setDraft(emptyDraft);
    setStyleGenres([]);
    setMode("wizard");
    setResult(null);
    setError(null);
    setStageIndex(0);
    setMoodSeed(0);
    setNarrativeSeed(0);
    setIsFinalizing(false);
    setIsComplete(false);
    setRespondentName("");
    setSubmitted(false);
    setLastSubmissionId(null);
    setLastSubmittedAt(null);
    setHasUnsavedChanges(false);
  };

  const backToWizard = () => {
    setMode("wizard");
    setIsFinalizing(false);
    setIsComplete(false);
    setHasUnsavedChanges(false);
  };

  const loadExample = () => {
    setDraft({
      bedrooms: 3,
      primaryUse: "Holiday home (rent when away)",
      whoStays: "Frequent guests",
      staffing: "Day staff (light)",
      boh: "Moderate (service route)",
      stairs: "Some stairs OK",
      privacy: "Private (screened)",
      indoorOutdoor: "Outdoor-first",
      experienceZone: "Mountain Terrace",
      plotSize: "600–800 sqm",
      values: [
        "Work-life balance and personal fulfilment",
        "Nature exploration and adventures",
        "Nutritional eating & healthy living",
        "Mind-body practices and nature-based spirituality",
        "Social gatherings and community events",
        "Eco-village and sustainable living",
        "Regeneration of natural resources",
        "Entrepreneurship and innovation"
      ],
      notes:
        "We host birthdays often and prefer quiet mornings. Avoid glossy finishes. Wheelchair-friendly circulation is essential.",
      materialMood: ["Light + natural"],
      pool: "Standard",
      parking: "2–3 cars",
      flexSpaces: ["Office", "Media"]
    });
    setStyleGenres(["Modern Tropical (Tropical Modernism)"]);
    setMoodSeed(0);
    setNarrativeSeed(0);
    setRespondentName("Alex Chen");
    setSubmitted(false);
    setLastSubmissionId(null);
  };

  const copyBrief = async () => {
    if (!result || !payload) return;
    const snapshotLines = [
      `Bedrooms: ${payload.bedrooms}`,
      `Primary use: ${payload.primaryUse}`,
      payload.whoStays ? `Who stays: ${payload.whoStays}` : null,
      `Staff & service: ${payload.staffing}`,
      `BOH separation: ${payload.boh}`,
      `Stairs tolerance: ${payload.stairs}`,
      `Privacy: ${payload.privacy}`,
      `Indoor–Outdoor: ${payload.indoorOutdoor}`,
      `Experience zone: ${draft.experienceZone ?? "—"}`,
      `Desired plot size: ${draft.plotSize ?? "—"}`,
      `Style direction: ${styleLabel}`
    ].filter(Boolean) as string[];

    const keyMetricsLines = [
      `Total Program Area: ${areaRangeLabel}`,
      `Bedroom Count: ${payload.bedrooms}`,
      `Primary Use: ${payload.primaryUse}`,
      `Privacy: ${payload.privacy}`,
      `Style Direction: ${styleLabel}`,
      `Experience Zone: ${draft.experienceZone ?? "—"}`,
      `Plot Size: ${draft.plotSize ?? "—"}`
    ];

    const valuesLines = valuesList.length
      ? valuesList.map((value) => `- ${value}`)
      : ["- —"];
    const notesLines = notesText
      ? notesText.split("\n").map((line) => (line ? line : ""))
      : ["None provided."];

    const briefText = markdownToPlainText(result.brief_md);

    const programLines = result.program.map(
      (item) =>
        `- ${item.space} | Qty: ${item.qty} | Area: ${formatArea(item.area_m2)} | Notes: ${
          item.notes ?? "-"
        }`
    );

    const plansLines = [
      "Option A — Privacy Courtyard",
      ...result.plans.optionA.notes.map((note) => `- ${note}`),
      ...result.plans.optionA.areas.map(
        (area) => `- ${area.label}: ${formatArea(area.area_m2)}`
      ),
      "",
      "Option B — View Terrace",
      ...result.plans.optionB.notes.map((note) => `- ${note}`),
      ...result.plans.optionB.areas.map(
        (area) => `- ${area.label}: ${formatArea(area.area_m2)}`
      )
    ];

    const materialsLines = finishesBoard
      ? [
          "Palette roles",
          ...paletteSwatches.map(
            (swatch) => `- ${swatch.label}: ${swatch.color}`
          ),
          "",
          "Key finish themes",
          ...themeChips.map((chip) => `- ${chip}`),
          "",
          ...finishesBoard.sections.flatMap((section) => [
            section.label,
            ...section.picks.flatMap((finish) => {
              const title = isGenericTitle(finish.title)
                ? `${finish.finish} — ${finish.title}`
                : finish.title;
              return [
                `- ${title}`,
                `  Finish: ${finish.finish}`,
                `  Use: ${finish.where}`,
                `  Why: ${finish.why}`,
                `  Fit: ${getFitLabel(finish)}`,
                `  Tags: ${finish.tone}, ${
                  finish.tier === "primary" ? "PRIMARY" : "SUPPORTING"
                }`
              ];
            }),
            ""
          ])
        ]
      : ["Select 1–3 styles to generate finishes."];

    const copyText = [
      "Concept Design Pack Results",
      "",
      ...(preparedForName ? [`Prepared for: ${preparedForName}`, ""] : []),
      "Narrative",
      result.narrative ?? "—",
      "",
      "Additional Notes",
      ...notesLines,
      "",
      "Snapshot answers",
      ...snapshotLines.map((line) => `- ${line}`),
      "",
      "Key Metrics",
      ...keyMetricsLines.map((line) => `- ${line}`),
      "",
      "Values & Culture",
      ...valuesLines,
      "",
      "Design Brief",
      briefText,
      "",
      "Space Program",
      ...programLines,
      "",
      "Plans",
      ...plansLines,
      "",
      "Materials & Finishes",
      ...materialsLines
    ].join("\n");
    try {
      await navigator.clipboard.writeText(copyText);
      pushToast("Brief copied to clipboard.");
    } catch {
      pushToast("Clipboard blocked. Select and copy manually.");
    }
  };

  const remixFinishes = () => {
    setMoodSeed((prev) => prev + 1);
    setHasUnsavedChanges(true);
  };

  const handleSubmitPack = async () => {
    if (!result || !payload || isSubmitting) return;
    setIsSubmitting(true);
    const submissionId = makeSubmissionId();
    const createdAt = new Date().toISOString();
    const sanitized = sanitizeName(preparedForName);
    const fileName = sanitized
      ? `KSV_Submission_${sanitized}_${submissionId}.json`
      : `KSV_Submission_${submissionId}.json`;

    const submissionPayload = {
      submissionId,
      createdAt,
      respondentName: preparedForName || undefined,
      inputs: payload,
      results: {
        narrative: result.narrative ?? "",
        notes: notesText || "",
        brief_md: result.brief_md,
        keyMetrics: {
          totalProgramArea: areaRangeLabel,
          bedroomCount: payload.bedrooms ?? null,
          primaryUse: payload.primaryUse ?? null,
          privacy: payload.privacy ?? null,
          styleDirection: styleLabel
        },
        snapshot: {
          bedrooms: payload.bedrooms ?? null,
          primaryUse: payload.primaryUse ?? null,
          whoStays: payload.whoStays ?? null,
          staffing: payload.staffing ?? null,
          boh: payload.boh ?? null,
          stairs: payload.stairs ?? null,
          privacy: payload.privacy ?? null,
          indoorOutdoor: payload.indoorOutdoor ?? null,
          styleDirection: styleLabel
        },
        values: valuesList,
        program: result.program,
        plans: result.plans,
        materialsFinishes: {
          palette: paletteSwatches,
          themeChips,
          sections: finishesBoard?.sections ?? []
        }
      },
      appMeta: {
        clientVersion: "demo-mvp",
        moodSeed,
        narrativeSeed,
        selectedStyleGenres: styleGenres
      }
    };

    const summaryText = [
      `Submission ID: ${submissionId}`,
      `Prepared for: ${preparedForName || "—"}`,
      `Created: ${createdAt}`,
      "",
      `Styles: ${styleGenres.length ? styleGenres.join(", ") : "—"}`,
      `Bedrooms: ${payload.bedrooms ?? "—"}`,
      `Primary use: ${payload.primaryUse ?? "—"}`,
      `Who stays: ${payload.whoStays ?? "—"}`,
      `Staffing: ${payload.staffing ?? "—"}`,
      `BOH: ${payload.boh ?? "—"}`,
      `Privacy: ${payload.privacy ?? "—"}`,
      `Indoor–outdoor: ${payload.indoorOutdoor ?? "—"}`,
      "",
      `Values (top): ${valuesList.length ? valuesList.join(", ") : "—"}`,
      `Notes: ${notesText || "—"}`,
      "",
      "Narrative:",
      result.narrative ?? "—"
    ].join("\n");

    try {
      const payloadForSheet = {
        ...submissionPayload,
        respondentName: preparedForName || "",
        submissionId,
        results: {
          ...submissionPayload.results,
          materialsFinishes: {
            ...submissionPayload.results.materialsFinishes,
            palette: safeString(submissionPayload.results.materialsFinishes?.palette),
            sections: safeString(submissionPayload.results.materialsFinishes?.sections)
          },
          plans: {
            ...submissionPayload.results.plans,
            optionA: {
              ...submissionPayload.results.plans.optionA,
              areas: safeString(submissionPayload.results.plans.optionA?.areas)
            },
            optionB: {
              ...submissionPayload.results.plans.optionB,
              areas: safeString(submissionPayload.results.plans.optionB?.areas)
            }
          },
          program: safeString(submissionPayload.results.program)
        }
      };
      downloadJson(fileName, submissionPayload);
      await copyToClipboard(summaryText);
      setSubmitted(true);
      setLastSubmissionId(submissionId);
      setLastSubmittedAt(new Date().toLocaleString());
      setHasUnsavedChanges(false);
      pushToast(`Submitted — saved ${fileName} and copied summary`);
      try {
        await fetch(
          "https://script.google.com/macros/s/AKfycbxvTlmT-q90eijoX96ljosPfmN2hMvnVkhlHkAo3Mq2_7J2CmEq_e-S05LQR7Swf8yE/exec",
          {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadForSheet)
          }
        );
        pushToast("Sent to Sheet (check in a moment).");
      } catch (err) {
        pushToast("Couldn’t send to Sheet. JSON was still downloaded.");
        console.error("Sheet submission failed:", err);
      }
    } catch {
      pushToast("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCsv = async () => {
    if (!result || !payload) return;
    const submissionId = lastSubmissionId ?? makeSubmissionId();
    const createdAt = new Date().toISOString();
    const sanitized = sanitizeName(preparedForName);
    const namePart = sanitized || "Unknown";
    const submissionFile = `KSV_Submission_${namePart}_${submissionId}_Submissions.csv`;
    const programFile = `KSV_Submission_${namePart}_${submissionId}_Program.csv`;

    const joinArray = (value?: string[] | null) =>
      value && value.length ? value.join(" | ") : "";

    const submissionsHeaders = [
      "submission_id",
      "created_at",
      "respondent_name",
      "bedrooms",
      "primary_use",
      "who_stays",
      "staffing",
      "boh",
      "stairs",
      "privacy",
      "indoor_outdoor",
      "experience_zone",
      "plot_size",
      "style_genres",
      "material_mood",
      "pool",
      "parking",
      "flex_spaces",
      "values",
      "notes",
      "narrative",
      "program_area_range",
      "primary_style_direction"
    ];

    const submissionsRows = [
      [
        submissionId,
        createdAt,
        preparedForName || "",
        payload.bedrooms ?? "",
        payload.primaryUse ?? "",
        payload.whoStays ?? "",
        payload.staffing ?? "",
        payload.boh ?? "",
        payload.stairs ?? "",
        payload.privacy ?? "",
        payload.indoorOutdoor ?? "",
        draft.experienceZone ?? "",
        draft.plotSize ?? "",
        joinArray(styleGenres),
        joinArray(draft.materialMood as string[] | undefined),
        draft.pool ?? "",
        draft.parking ?? "",
        joinArray(draft.flexSpaces as string[] | undefined),
        joinArray(valuesList),
        notesText || "",
        result.narrative ?? "",
        areaRangeLabel,
        styleLabel
      ]
    ];

    const programHeaders = [
      "submission_id",
      "created_at",
      "space",
      "qty",
      "area_m2",
      "notes"
    ];

    const programRows = result.program.map((item) => [
      submissionId,
      createdAt,
      item.space,
      item.qty,
      item.area_m2,
      item.notes ?? ""
    ]);

    try {
      downloadCsv(submissionFile, buildCsv(submissionsHeaders, submissionsRows));
      downloadCsv(programFile, buildCsv(programHeaders, programRows));
      pushToast("CSV exported — Downloaded 2 CSV files.", 3000);
    } catch {
      pushToast("CSV export failed. Please try again.");
    }
  };

  const regenerateNarrative = async () => {
    if (!payload) return;
    const nextSeed = narrativeSeed + 1;
    setNarrativeSeed(nextSeed);
    setIsNarrativeLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, narrativeSeed: nextSeed })
      });
      if (!response.ok) {
        throw new Error("Narrative regeneration failed.");
      }
      const data = (await response.json()) as GenerateResponse;
      setResult((prev) =>
        prev ? { ...prev, narrative: data.narrative ?? prev.narrative } : prev
      );
      setHasUnsavedChanges(true);
    } catch {
      pushToast("Unable to regenerate narrative.");
    } finally {
      setIsNarrativeLoading(false);
    }
  };

  const downloadPack = async () => {
    if (!result) return;

    const board = finishesBoard ?? buildFinishesBoard(styleGenres, moodSeed);

    const finishSectionsHtml = board
      ? board.sections
          .map((section) => {
            const cards = section.picks
              .map(
                (chip) => `
            <div class="finish-card">
              <h4>${escapeHtml(chip.title)}</h4>
              <p>Finish: ${escapeHtml(chip.finish)}</p>
              <p>Use: ${escapeHtml(chip.where)}</p>
              <p>Why: ${escapeHtml(chip.why)}</p>
              <p>Fit: ${escapeHtml(getFitLabel(chip))}</p>
              <div class="finish-tags">
                <span class="pill">${chip.tone}</span>
                <span class="pill">${chip.tier.toUpperCase()}</span>
              </div>
            </div>
          `
              )
              .join("");
            return `
            <div class="finish-group">
              <h3>${escapeHtml(section.label)} <span class="pill">4 picks</span></h3>
              <div class="finish-grid">
                ${cards}
              </div>
            </div>
          `;
          })
          .join("")
      : `<p>Select 1–3 styles to generate finishes.</p>`;

    const programRows = result.program
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.space)}</td>
            <td>${item.qty}</td>
            <td>${Math.round(item.area_m2)} m²</td>
            <td>${escapeHtml(item.notes ?? "-")}</td>
          </tr>
        `
      )
      .join("");

    const finishHtml = `
      <h3>Materials &amp; Finishes</h3>
      <p>Decision-ready finish guidance (no inspiration images).</p>
      <h4>Palette</h4>
      <div class="palette">
        ${paletteSwatches
          .map(
            (swatch) =>
              `<span class="swatch"><i style="background:${swatch.color}"></i>${escapeHtml(
                swatch.label
              )}</span>`
          )
          .join("")}
      </div>
      <h4>Key finish themes</h4>
      ${themeChips
        .map((chip) => `<span class="pill">${escapeHtml(chip)}</span>`)
        .join("")}
      ${finishSectionsHtml}
    `;

    const narrativeHtml = `
      <section>
        <h2>Narrative</h2>
        <p>${escapeHtml(result.narrative ?? "—")}</p>
      </section>
    `;

    const notesHtml = `
      <section>
        <h2>Additional Notes</h2>
        <p>${notesText ? escapeHtml(notesText).replace(/\n/g, "<br/>") : "No additional notes provided."}</p>
      </section>
    `;

    const snapshotItems = [
      ["Bedrooms", payload?.bedrooms ?? "-"],
      ["Primary use", payload?.primaryUse ?? "-"],
      ["Who stays", payload?.whoStays ?? "-"],
      ["Staff & service", payload?.staffing ?? "-"],
      ["BOH separation", payload?.boh ?? "-"],
      ["Stairs tolerance", payload?.stairs ?? "-"],
      ["Privacy", payload?.privacy ?? "-"],
      ["Indoor–Outdoor", payload?.indoorOutdoor ?? "-"],
      ["Experience zone", draft.experienceZone ?? "-"],
      ["Desired plot size", draft.plotSize ?? "-"],
      ["Style direction", styleLabel]
    ];

    const keyMetricsHtml = `
      <section>
        <h2>Key Metrics</h2>
        <ul>
          <li>Total Program Area: ${escapeHtml(areaRangeLabel)}</li>
          <li>Bedroom Count: ${escapeHtml(String(payload?.bedrooms ?? "-"))}</li>
          <li>Primary Use: ${escapeHtml(payload?.primaryUse ?? "-")}</li>
          <li>Privacy: ${escapeHtml(payload?.privacy ?? "-")}</li>
          <li>Style Direction: ${escapeHtml(styleLabel)}</li>
          <li>Experience Zone: ${escapeHtml(draft.experienceZone ?? "-")}</li>
          <li>Plot Size: ${escapeHtml(draft.plotSize ?? "-")}</li>
        </ul>
        <h3>Snapshot answers</h3>
        <ul>
          ${snapshotItems
            .map(
              ([label, value]) =>
                `<li>${escapeHtml(label)}: ${escapeHtml(String(value ?? "-"))}</li>`
            )
            .join("")}
        </ul>
      </section>
    `;

    const valuesHtml = `
      <section>
        <h2>Values &amp; Culture</h2>
        <p>${valuesList.length ? valuesList.map((value) => escapeHtml(value)).join(", ") : "—"}</p>
      </section>
    `;

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Kamala Secret Valley — Concept Design Pack</title>
    <style>
      :root { color-scheme: light; }
      body {
        margin: 0;
        font-family: "Space Grotesk", Arial, sans-serif;
        color: #2f2b23;
        background: #fdfaf5;
      }
      main { max-width: 980px; margin: 0 auto; padding: 40px 28px 60px; }
      h1, h2, h3, h4 { font-family: "Cormorant Garamond", Georgia, serif; margin: 0 0 12px; }
      h1 { font-size: 36px; }
      h2 { font-size: 26px; margin-top: 28px; }
      h3 { font-size: 20px; margin-top: 18px; }
      p { line-height: 1.6; margin: 0 0 12px; }
      ul { padding-left: 18px; margin: 8px 0 16px; }
      li { margin-bottom: 6px; }
      section { border: 1px solid #efe5d7; border-radius: 20px; padding: 24px; margin-top: 20px; background: #ffffff; }
      table { width: 100%; border-collapse: collapse; font-size: 14px; }
      th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #efe5d7; }
      .plans { display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
      .plan-card { border: 1px solid #efe5d7; border-radius: 16px; padding: 16px; background: #fff; }
      .plan-card svg { width: 100%; height: auto; }
      .pill { display: inline-block; margin: 6px 6px 0 0; padding: 4px 10px; font-size: 12px; border-radius: 999px; background: #f6efe6; }
      .finish-group { margin-top: 16px; }
      .finish-grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
      .finish-card { border: 1px solid #efe5d7; border-radius: 14px; padding: 12px; background: #fff; }
      .finish-card h4 { margin: 0 0 6px; font-size: 14px; font-family: "Cormorant Garamond", Georgia, serif; color: #2f2b23; }
      .finish-card p { margin: 0 0 4px; font-size: 12px; color: #6c573c; }
      .palette { display: flex; flex-wrap: wrap; gap: 10px; }
      .swatch { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 999px; border: 1px solid #efe5d7; font-size: 12px; }
      .swatch i { width: 16px; height: 16px; border-radius: 999px; display: inline-block; border: 1px solid #efe5d7; }
      .finish-card.core { border-color: #e7d4b8; background: #fffaf2; }
      .finish-card.accent { border-color: #efe5d7; }
      .finish-tags { margin-top: 6px; display: flex; flex-wrap: wrap; gap: 6px; }
      @media print {
        section, .plan-card, .finish-card {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        h2, h3, h4 { break-after: avoid; }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Kamala Secret Valley — Concept Design Pack</h1>
      <p>Generated with VillaBrief.</p>

      ${narrativeHtml}

      ${notesHtml}

      <section>
        <h2>Design Brief</h2>
        ${markdownToHtml(result.brief_md)}
      </section>

      ${keyMetricsHtml}

      ${valuesHtml}

      <section>
        <h2>Space Program</h2>
        <table>
          <thead>
            <tr>
              <th>Space</th>
              <th>Qty</th>
              <th>Area (m² total)</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${programRows}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Plans</h2>
        <div class="plans">
          <div class="plan-card">
            <h3>Option A — Privacy Courtyard</h3>
            ${result.plans.optionA.svg}
            <ul>
              ${result.plans.optionA.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
            </ul>
            ${result.plans.optionA.areas
              .map((area) => `<span class="pill">${escapeHtml(area.label)}: ${Math.round(area.area_m2)} m²</span>`)
              .join("")}
          </div>
          <div class="plan-card">
            <h3>Option B — View Terrace</h3>
            ${result.plans.optionB.svg}
            <ul>
              ${result.plans.optionB.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
            </ul>
            ${result.plans.optionB.areas
              .map((area) => `<span class="pill">${escapeHtml(area.label)}: ${Math.round(area.area_m2)} m²</span>`)
              .join("")}
          </div>
        </div>
      </section>

      <section>
        <h2>Materials &amp; Finishes</h2>
        <p>Decision-ready finish guidance (no inspiration images).</p>
        <h3>Palette</h3>
        <div class="palette">
          ${paletteSwatches
            .map(
              (swatch) =>
                `<span class="swatch"><i style="background:${swatch.color}"></i>${escapeHtml(
                  swatch.label
                )} (${escapeHtml(swatch.color)})</span>`
            )
            .join("")}
        </div>
        ${finishHtml}
      </section>
    </main>
  </body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const sanitizedName = sanitizeName(preparedForName);
    link.download = sanitizedName
      ? `KSV_Concept_Design_Pack_${sanitizedName}.pdf`
      : "KSV_Concept_Design_Pack.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    pushToast("Concept Design Pack downloaded.");
  };

  if (mode === "loading") {
    const isPackComplete = isComplete || isFinalizing;
    return (
      <main className="px-6 py-12 lg:px-16">
        <ToastStack toasts={toasts} />
        <div className="mx-auto max-w-4xl space-y-10">
          <header className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-sand-700">
              Kamala Secret Valley — Villa Brief
            </p>
            <h1 className="font-serif text-4xl text-clay-900">
              Ready to share
            </h1>
            <p className="text-sm text-sand-700">
              A concise design brief, program, and finishes guidance—structured
              from your inputs, in one place.
            </p>
          </header>

          <section className="card p-8">
            <div className="flex flex-col gap-6">
              {steps.map((step, index) => {
                const isStepComplete = isPackComplete || index < stageIndex;
                const isStepActive = !isPackComplete && index === stageIndex;

                return (
                  <div
                    key={step}
                    className="flex items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-full border text-sm font-semibold grid place-items-center ${
                          isStepComplete
                            ? "border-sea-500 bg-sea-500 text-white"
                            : isStepActive
                              ? "border-clay-500 bg-clay-100 text-clay-800"
                              : "border-sand-300 text-sand-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-clay-900">{step}</p>
                        <p className="text-xs text-sand-600">
                          {isPackComplete
                            ? "Complete"
                            : isStepComplete
                              ? "Locked in"
                              : isStepActive
                              ? "In progress"
                              : "Queued"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`h-2 w-24 rounded-full ${
                        isStepComplete
                          ? "bg-sea-400"
                          : isStepActive
                            ? "bg-gradient-to-r from-clay-300 via-sand-200 to-sand-100 animate-shimmer"
                            : "bg-sand-200"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
            {isPackComplete ? (
              <div className="mt-6 rounded-2xl border border-sand-200 bg-neutral-50/60 p-4">
                <p className="font-medium text-clay-900">Pack ready</p>
                <p className="text-xs text-sand-600">
                  We turned your answers into a structured brief, spatial
                  options, and decision-ready finishes.
                </p>
              </div>
            ) : null}
          </section>
          {isPackComplete ? (
            <p className="text-xs text-sand-600">
              You’re ready to share or download your pack.
            </p>
          ) : null}
        </div>
      </main>
    );
  }

  if (mode === "results" && result) {
    return (
      <main className="px-6 py-10 lg:px-16">
        <ToastStack toasts={toasts} />
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="sticky top-0 z-30">
            <div className="mx-auto w-full max-w-6xl py-3">
              <div className="card-strong px-5 py-5 lg:px-8 lg:py-6">
                <div className="grid gap-4 lg:grid-cols-[auto_1fr_auto] lg:items-start">
                  <div className="flex items-start">
                    <button
                      type="button"
                      onClick={backToWizard}
                      className="inline-flex items-center gap-2 rounded-full border border-sand-300 px-4 py-2 text-xs font-semibold text-sand-700 transition hover:border-sand-500"
                    >
                      <span aria-hidden="true">←</span>
                      Back
                    </button>
                  </div>
                  <div className="space-y-2 text-left">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-sand-600">
                      Kamala Secret Valley — Villa Brief
                    </p>
                    <h1 className="font-serif text-2xl lg:text-3xl text-clay-900">
                      Concept Design Pack
                    </h1>
                    <p className="text-sm text-sand-700">
                      Prepared for: {preparedForName || "—"}
                      {lastSubmissionId ? ` • Submission: ${lastSubmissionId}` : ""}
                    </p>
                    <p className="text-xs text-sand-500">
                      {submitted
                        ? lastSubmittedAt
                          ? `Submitted • ${lastSubmittedAt}`
                          : "Submitted"
                        : "Draft pack ready — review and Submit to confirm."}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex flex-wrap items-center gap-3 justify-end">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setIsShareOpen((prev) => !prev);
                          }}
                          className="h-11 rounded-full border border-sand-300 px-4 text-sm font-semibold text-sand-700 transition hover:border-sand-500"
                        >
                          Share / Export ▾
                        </button>
                        {isShareOpen ? (
                          <div
                            className="absolute right-0 mt-2 w-52 rounded-2xl border border-sand-200 bg-white p-2 shadow-soft"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setIsShareOpen(false);
                                void downloadPack();
                              }}
                              className="w-full rounded-xl px-3 py-2 text-left text-sm text-sand-700 hover:bg-sand-100"
                            >
                              Download pack
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsShareOpen(false);
                                void copyBrief();
                              }}
                              className="w-full rounded-xl px-3 py-2 text-left text-sm text-sand-700 hover:bg-sand-100"
                            >
                              Copy pack text
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsShareOpen(false);
                                void handleExportCsv();
                              }}
                              className="w-full rounded-xl px-3 py-2 text-left text-sm text-sand-700 hover:bg-sand-100"
                            >
                              Export CSV
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={handleSubmitPack}
                        disabled={isSubmitting}
                        className={`h-11 rounded-full px-5 text-sm font-semibold transition ${
                          isSubmitting
                            ? "cursor-not-allowed bg-sand-200 text-sand-500"
                            : "bg-clay-600 text-white hover:bg-clay-700"
                        }`}
                      >
                        {isSubmitting
                          ? "Submitting…"
                          : !submitted
                            ? "Submit"
                            : hasUnsavedChanges
                              ? "Resubmit"
                              : "Submitted"}
                      </button>
                    </div>
                    <p className="text-[11px] text-sand-500">
                      Sends to KSV Submissions sheet + email receipt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <div className="border-b border-sand-200">
                <div className="flex flex-wrap gap-6">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "architect", label: "Brief for Architect" },
                    { id: "finishes", label: "Finishes" }
                  ].map((tab) => {
                    const isActive = resultsTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() =>
                          setResultsTab(
                            tab.id as "overview" | "architect" | "finishes"
                          )
                        }
                        className={`-mb-px border-b-2 pb-2 text-sm font-semibold transition ${
                          isActive
                            ? "border-clay-600 text-clay-900"
                            : "border-transparent text-sand-500 hover:text-sand-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-xs text-sand-500">
                3 sections • Overview, Brief for Architect, Finishes
              </p>
            </div>

            {resultsTab === "overview" ? (
              <div className="space-y-6">
                <section className="card p-5">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        label: "Bedrooms",
                        value: payload?.bedrooms ?? "—"
                      },
                      {
                        label: "Primary Use",
                        value: payload?.primaryUse ?? "—"
                      },
                      {
                        label: "Style",
                        value: styleLabel
                      },
                      {
                        label: "Target Area",
                        value: areaRangeLabel
                      },
                      {
                        label: "Privacy",
                        value: payload?.privacy ?? "—"
                      },
                      {
                        label: "Staffing / BOH",
                        value: `${payload?.staffing ?? "—"} • ${
                          payload?.boh ?? "—"
                        }`
                      },
                      {
                        label: "Accessibility / Stairs",
                        value: payload?.stairs ?? "—"
                      }
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-sand-200 bg-white px-3 py-3"
                      >
                        <p className="text-[11px] uppercase tracking-[0.25em] text-sand-500">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-clay-900">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                  <section className="card-strong p-6 lg:p-7 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h2 className="font-serif text-2xl text-clay-900">
                          Narrative
                        </h2>
                        <p className="text-sm text-sand-700">
                          A distilled description of how daily life and hosting
                          will feel in this villa.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={regenerateNarrative}
                        disabled={isNarrativeLoading || !payload}
                        className={`h-9 rounded-full border px-4 text-xs font-semibold transition ${
                          isNarrativeLoading || !payload
                            ? "cursor-not-allowed border-sand-200 text-sand-400"
                            : "border-sand-300 text-sand-700 hover:border-sand-500"
                        }`}
                      >
                        {isNarrativeLoading
                          ? "Regenerating…"
                          : "Regenerate"}
                      </button>
                    </div>
                    <div className="mt-2 rounded-2xl border border-sand-200 bg-neutral-50/60 p-4">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                        In one line
                      </p>
                      <p className="mt-2 text-sm font-medium text-clay-900">
                        {(() => {
                          const text = result.narrative ?? "";
                          const match = text.match(/[^.!?]+[.!?]/);
                          return (
                            match?.[0].trim() ||
                            "A calm, outdoor-first villa shaped for privacy, hosting, and everyday ease."
                          );
                        })()}
                      </p>
                    </div>
                    <div className="border-t border-sand-200 pt-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                        Full narrative
                      </p>
                      <p className="mt-2 text-sm lg:text-[15px] leading-7 text-neutral-700">
                        {result.narrative ?? "—"}
                      </p>
                    </div>
                  </section>

                  <section className="card p-7 space-y-6">
                    <div className="space-y-3">
                      <h2 className="font-serif text-2xl text-clay-900">
                        Key Metrics
                      </h2>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-sand-600">
                            Total Program Area
                          </span>
                          <span className="font-semibold text-clay-900">
                            {areaRangeLabel}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sand-600">Bedroom Count</span>
                          <span className="font-semibold text-clay-900">
                            {payload?.bedrooms ?? "-"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sand-600">Primary Use</span>
                          <span className="font-semibold text-clay-900">
                            {payload?.primaryUse ?? "-"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sand-600">Privacy</span>
                          <span className="font-semibold text-clay-900">
                            {payload?.privacy ?? "-"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sand-600">Style Direction</span>
                          <span className="font-semibold text-clay-900">
                            {styleLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-sand-200 pt-4 space-y-3">
                      <h3 className="text-xs uppercase tracking-[0.3em] text-sand-500">
                        Operational flags
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-sand-600">
                            Staff &amp; service
                          </span>
                          <span className="font-semibold text-clay-900">
                            {payload?.staffing ?? "-"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sand-600">BOH separation</span>
                          <span className="font-semibold text-clay-900">
                            {payload?.boh ?? "-"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sand-600">Stairs tolerance</span>
                          <span className="font-semibold text-clay-900">
                            {payload?.stairs ?? "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>
                </section>

                <section className="card p-5 lg:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-3 lg:gap-6 items-start">
                    <div className="space-y-1">
                      <h2 className="font-serif text-xl text-clay-900">
                        Client notes
                      </h2>
                      <p className="text-xs text-sand-600">
                        Anything the family wants the design team to know.
                      </p>
                    </div>
                    <div className="rounded-xl border border-sand-200 bg-neutral-50/60 p-4">
                      {preparedForName ? (
                        <p className="text-xs font-semibold text-sand-600">
                          Client: {preparedForName}
                        </p>
                      ) : null}
                      {notesText ? (
                        <p
                          className={`text-sm text-sand-700 whitespace-pre-line ${
                            preparedForName ? "mt-2" : ""
                          }`}
                        >
                          {notesText}
                        </p>
                      ) : (
                        <p
                          className={`text-sm text-sand-600 ${
                            preparedForName ? "mt-2" : ""
                          }`}
                        >
                          No additional notes provided.
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="card-strong p-6 space-y-3">
                  <h2 className="font-serif text-xl text-clay-900">
                    Design Intent
                  </h2>
                  <ul className="space-y-2 text-sm text-sand-700">
                    {designIntentBullets.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </section>
              </div>
            ) : null}

            {resultsTab === "architect" ? (
              <div className="space-y-6">
                <section className="card-strong p-7 space-y-4">
                  <h2 className="font-serif text-2xl text-clay-900">Snapshot</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {[
                      { label: "Bedrooms", value: payload?.bedrooms ?? "—" },
                      { label: "Primary use", value: payload?.primaryUse ?? "—" },
                      { label: "Privacy", value: payload?.privacy ?? "—" },
                      { label: "Staffing", value: payload?.staffing ?? "—" },
                      { label: "BOH separation", value: payload?.boh ?? "—" },
                      { label: "Stairs tolerance", value: payload?.stairs ?? "—" },
                      {
                        label: "Indoor–outdoor",
                        value: payload?.indoorOutdoor ?? "—"
                      },
                      { label: "Style", value: styleLabel }
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-sand-500">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium text-clay-900">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="card-strong p-7 space-y-4">
                  <h2 className="font-serif text-2xl text-clay-900">
                    Spatial Priorities
                  </h2>
                  <div className="grid gap-4">
                    {[
                      {
                        label: "Arrival & first impression",
                        items: spatialGroups.arrival
                      },
                      {
                        label: "Social core (living/terrace/pool)",
                        items: spatialGroups.social
                      },
                      {
                        label: "Private wing (bedrooms)",
                        items: spatialGroups.privateWing
                      },
                      {
                        label: "Service & operations (BOH/storage/laundry)",
                        items: spatialGroups.service
                      }
                    ].map((group) => (
                      <div key={group.label}>
                        <p className="text-xs uppercase tracking-[0.3em] text-sand-500">
                          {group.label}
                        </p>
                        {group.items.length ? (
                          <ul className="mt-2 space-y-1 text-sm text-sand-700">
                            {group.items.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-xs text-sand-400">—</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="card p-6 space-y-4">
                  <h2 className="font-serif text-xl text-clay-900">
                    Operational flags
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sand-600">Parking</span>
                      <span className="font-semibold text-clay-900">
                        {payload?.parking ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sand-600">Pool</span>
                      <span className="font-semibold text-clay-900">
                        {payload?.pool ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sand-600">Staffing</span>
                      <span className="font-semibold text-clay-900">
                        {payload?.staffing ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sand-600">BOH separation</span>
                      <span className="font-semibold text-clay-900">
                        {payload?.boh ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sand-600">Stairs tolerance</span>
                      <span className="font-semibold text-clay-900">
                        {payload?.stairs ?? "—"}
                      </span>
                    </div>
                  </div>
                </section>

                <p className="text-xs text-sand-500">
                  Assumptions: Areas and specs are indicative until architect
                  review.
                </p>
              </div>
            ) : null}

            {resultsTab === "finishes" ? (
              <section className="card-strong p-7 space-y-6">
                <div>
                  <h2 className="font-serif text-2xl text-clay-900">
                    Materials
                  </h2>
                  <p className="text-sm text-sand-700">
                    A simplified spec direction for quick alignment.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-6">
                  {paletteSwatches.map((swatch) => (
                    <div
                      key={swatch.label}
                      className="rounded-2xl border border-sand-300 bg-white p-3 shadow-soft"
                    >
                      <div
                        className="h-12 w-full rounded-xl border border-sand-300"
                        style={{ backgroundColor: swatch.color }}
                      />
                      <p className="mt-2 text-xs font-semibold text-clay-900">
                        {swatch.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-5">
                    {[
                      { label: "Walls & ceilings", items: materialSpecs.walls },
                      { label: "Floors & stone", items: materialSpecs.floors },
                      { label: "Timber / joinery", items: materialSpecs.timber },
                      { label: "Screens / shading", items: materialSpecs.screens },
                      { label: "Metal / fixtures", items: materialSpecs.metals }
                    ].map((section) => (
                      <div key={section.label} className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-sand-600">
                          {section.label}
                        </p>
                        <ul className="space-y-1 text-sm text-sand-700">
                          {section.items.slice(0, 5).map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-sand-200 bg-neutral-50/60 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-sand-600">
                      Avoid / Don’t
                    </p>
                    <ul className="mt-3 space-y-1 text-sm text-sand-700">
                      <li>• Glossy tiles</li>
                      <li>• Polished marble floors</li>
                      <li>• Mirror chrome fixtures</li>
                      <li>• High-contrast veined stone</li>
                      <li>• Reflective lacquer cabinetry</li>
                      <li>• Cheap faux-wood laminates</li>
                      <li>• Slippery outdoor floors</li>
                      <li>• Overly dark interiors</li>
                      <li>• Busy patterned tiles</li>
                      <li>• Exposed cluttered services</li>
                    </ul>
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 pb-32 pt-12 lg:px-16">
      <ToastStack toasts={toasts} />
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <header className="space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-sand-700">
            Kamala Secret Valley — Villa Brief
          </p>
          <h1 className="font-serif text-4xl leading-tight text-clay-900">
            A one-page villa brief that turns preferences into spatial
            direction.
          </h1>
          <p className="text-sm text-sand-700 max-w-2xl">
            Answer each question and receive a design brief, space program, two
            plan options, and a Materials &amp; Finishes board. No login, no database, just a
            crisp starting point.
          </p>
          {error ? (
            <p className="rounded-2xl border border-clay-200 bg-clay-50 px-4 py-3 text-sm text-clay-700">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadExample}
              className="rounded-full border border-sand-300 px-4 py-3 text-xs font-semibold text-sand-700 transition hover:border-sand-500"
            >
              Load Example
            </button>
            <p className="text-xs text-sand-600">
              Likely concept:{" "}
              <span className="font-semibold text-clay-900">
                {likelyConcept}
              </span>
            </p>
          </div>
        </header>

        <section className="card p-6 space-y-3">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl text-clay-900">About you</h2>
            <p className="text-xs text-sand-600">Used only to label the pack.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-sand-600">
              Your name (optional)
            </label>
            <input
              type="text"
              value={respondentName}
              onChange={(event) => handleNameChange(event.target.value)}
              onBlur={handleNameBlur}
              placeholder="e.g., Alex Chen"
              className="w-full rounded-2xl border border-sand-200 bg-white/80 px-4 py-3 text-sm text-sand-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-clay-300"
            />
          </div>
        </section>

        <section className="space-y-6">
          {questions.map((question) => {
            const anchorId = `q-${String(question.id)}`;
            const isHighlighted = highlightedId === anchorId;
            return (
            <div
              key={question.title}
              id={anchorId}
              className={`card p-6 space-y-4 transition ${
                isHighlighted ? "ring-2 ring-clay-300 bg-clay-50/70" : ""
              }`}
            >
              <div>
                <h2 className="font-serif text-2xl text-clay-900">
                  {question.title}
                </h2>
                <p className="text-xs uppercase tracking-[0.3em] text-sand-600">
                  {question.subtitle}
                </p>
              </div>
              <div
                className={`grid gap-3 ${
                  question.columns === 2
                    ? "sm:grid-cols-2"
                    : question.columns === 3
                      ? "sm:grid-cols-3"
                      : "sm:grid-cols-2"
                }`}
              >
                {question.options.map((option) => {
                  const selected = draft[question.id] === option.value;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => handleSelect(question.id, option.value)}
                      className={`relative flex flex-col rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        selected
                          ? "border-clay-600 bg-clay-50 text-clay-900 shadow-inner"
                          : "border-sand-200 bg-white/80 text-sand-700 hover:border-sand-400"
                      }`}
                    >
                      {selected ? (
                        <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-clay-600 text-white">
                          <svg
                            viewBox="0 0 16 16"
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3.5 8.5l3 3 6-6" />
                          </svg>
                        </span>
                      ) : null}
                      <span className="font-semibold">{option.label}</span>
                      {option.hint ? (
                        <span className="text-[11px] text-sand-500">
                          {option.hint}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
          })}
        </section>

          <section
          id="q-values"
          className={`card p-6 space-y-4 transition ${
            highlightedId === "q-values"
              ? "ring-2 ring-clay-300 bg-clay-50/70"
              : ""
          }`}
        >
          <div>
            <h2 className="font-serif text-2xl text-clay-900">
              Values &amp; Culture
            </h2>
            <p className="text-xs uppercase tracking-[0.3em] text-sand-600">
              What matters most in your life? (Choose up to 10)
            </p>
            <p className="mt-2 text-xs text-sand-500">
              {valuesCount}/10 selected
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {valuesOptions.map((option) => {
              const selected = draft.values?.includes(option) ?? false;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleValues(option)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition ${
                    selected
                      ? "border-clay-600 bg-clay-50 text-clay-900"
                      : "border-sand-200 bg-white/80 text-sand-700 hover:border-sand-400"
                  }`}
                >
                  {selected ? (
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-clay-600 text-white">
                      <svg
                        viewBox="0 0 16 16"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3.5 8.5l3 3 6-6" />
                      </svg>
                    </span>
                  ) : null}
                  {option}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl text-clay-900">
              Design preferences
            </h2>
            <p className="text-xs uppercase tracking-[0.3em] text-sand-600">
              Refine materials, finishes, and operational details
            </p>
          </div>

          <div
            id="q-style"
            className={`card p-6 space-y-4 transition ${
              highlightedId === "q-style"
                ? "ring-2 ring-clay-300 bg-clay-50/70"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-clay-900">
                Architectural Style
              </h3>
              <span className="text-xs text-sand-500">Choose up to 3</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {styleGenreOptions.map((option) => {
                const selected = styleGenres.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleStyleGenre(option.value)}
                    className={`relative rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      selected
                        ? "border-clay-600 bg-clay-50 text-clay-900 shadow-inner"
                        : "border-sand-200 bg-white/80 text-sand-700 hover:border-sand-400"
                    }`}
                  >
                    {selected ? (
                      <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-clay-600 text-white">
                        <svg
                          viewBox="0 0 16 16"
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3.5 8.5l3 3 6-6" />
                        </svg>
                      </span>
                    ) : null}
                    <span className="font-semibold">{option.label}</span>
                    <span className="mt-1 text-[11px] text-sand-500">
                      {option.hint}
                    </span>
                  </button>
                );
              })}
            </div>
            {styleLimitHint ? (
              <p className="text-xs text-sand-500">Max 3 styles.</p>
            ) : null}
          </div>

          <div
            id="q-materialMood"
            className={`card p-6 space-y-4 transition ${
              highlightedId === "q-materialMood"
                ? "ring-2 ring-clay-300 bg-clay-50/70"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-clay-900">
                Material mood
              </h3>
              <span className="text-xs text-sand-500">Select up to 2</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {materialMoodOptions.map((option) => {
                const selected = draft.materialMood?.includes(option) ?? false;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleMultiSelect("materialMood", option, 2)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition ${
                      selected
                        ? "border-clay-600 bg-clay-50 text-clay-900"
                        : "border-sand-200 bg-white/80 text-sand-700 hover:border-sand-400"
                    }`}
                  >
                    {selected ? (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-clay-600 text-white">
                        <svg
                          viewBox="0 0 16 16"
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3.5 8.5l3 3 6-6" />
                        </svg>
                      </span>
                    ) : null}
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id="q-pool"
            className={`card p-6 space-y-4 transition ${
              highlightedId === "q-pool"
                ? "ring-2 ring-clay-300 bg-clay-50/70"
                : ""
            }`}
          >
            <h3 className="font-serif text-xl text-clay-900">Pool preference</h3>
            <div className="grid gap-3 sm:grid-cols-4">
              {poolOptions.map((option) => {
                const selected = draft.pool === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect("pool", option)}
                    className={`relative rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      selected
                        ? "border-clay-600 bg-clay-50 text-clay-900 shadow-inner"
                        : "border-sand-200 bg-white/80 text-sand-700 hover:border-sand-400"
                    }`}
                  >
                    {selected ? (
                      <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-clay-600 text-white">
                        <svg
                          viewBox="0 0 16 16"
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3.5 8.5l3 3 6-6" />
                        </svg>
                      </span>
                    ) : null}
                    <span className="font-semibold">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id="q-parking"
            className={`card p-6 space-y-4 transition ${
              highlightedId === "q-parking"
                ? "ring-2 ring-clay-300 bg-clay-50/70"
                : ""
            }`}
          >
            <h3 className="font-serif text-xl text-clay-900">Parking</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {parkingOptions.map((option) => {
                const selected = draft.parking === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect("parking", option)}
                    className={`relative rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      selected
                        ? "border-clay-600 bg-clay-50 text-clay-900 shadow-inner"
                        : "border-sand-200 bg-white/80 text-sand-700 hover:border-sand-400"
                    }`}
                  >
                    {selected ? (
                      <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-clay-600 text-white">
                        <svg
                          viewBox="0 0 16 16"
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3.5 8.5l3 3 6-6" />
                        </svg>
                      </span>
                    ) : null}
                    <span className="font-semibold">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id="q-flexSpaces"
            className={`card p-6 space-y-4 transition ${
              highlightedId === "q-flexSpaces"
                ? "ring-2 ring-clay-300 bg-clay-50/70"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-clay-900">Flex spaces</h3>
              <span className="text-xs text-sand-500">Select up to 3</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {flexSpaceOptions.map((option) => {
                const selected = draft.flexSpaces?.includes(option) ?? false;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleMultiSelect("flexSpaces", option, 3)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition ${
                      selected
                        ? "border-clay-600 bg-clay-50 text-clay-900"
                        : "border-sand-200 bg-white/80 text-sand-700 hover:border-sand-400"
                    }`}
                  >
                    {selected ? (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-clay-600 text-white">
                        <svg
                          viewBox="0 0 16 16"
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3.5 8.5l3 3 6-6" />
                        </svg>
                      </span>
                    ) : null}
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="q-notes"
          className={`card p-6 space-y-4 transition ${
            highlightedId === "q-notes"
              ? "ring-2 ring-clay-300 bg-clay-50/70"
              : ""
          }`}
        >
          <div>
            <h2 className="font-serif text-2xl text-clay-900">
              Any other information
            </h2>
            <p className="text-xs uppercase tracking-[0.3em] text-sand-600">
              Share anything that would help the designer (must-haves, dislikes,
              routines, special needs, pets, accessibility, cultural practices,
              hosting patterns).
            </p>
            <p className="mt-2 text-xs text-sand-500">
              {notesCount}/600
            </p>
          </div>
          <textarea
            value={notesValue}
            onChange={(event) => handleNotesChange(event.target.value)}
            onBlur={handleNotesBlur}
            rows={4}
            maxLength={600}
            placeholder="e.g., ‘We host birthdays often’, ‘Quiet mornings’, ‘No glossy finishes’, ‘Need wheelchair-friendly circulation’, ‘Outdoor shower is a must’…"
            className="w-full rounded-2xl border border-sand-200 bg-white/80 px-4 py-3 text-sm text-sand-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-clay-300"
          />
        </section>

        <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-sand-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-16">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-sand-600">
                <span>
                  {answeredCount}/{totalCount} answered
                </span>
                <button
                  type="button"
                  onClick={scrollToFirstUnanswered}
                  className="text-xs font-semibold text-sand-600 underline decoration-dashed underline-offset-4 hover:text-sand-800"
                >
                  Jump to next unanswered
                </button>
              </div>
              <div className="h-1 w-full rounded-full bg-sand-200">
                <div
                  className="h-1 rounded-full bg-clay-500 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div
              className="flex flex-col items-start gap-2 sm:items-end"
              onClick={() => {
                if (!isFormComplete) {
                  scrollToFirstUnanswered();
                }
              }}
            >
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormComplete}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                  isFormComplete
                    ? "bg-clay-600 text-white hover:bg-clay-700"
                    : "bg-sand-200 text-sand-500 cursor-not-allowed pointer-events-none"
                }`}
              >
                Generate Concept Design Pack
              </button>
              {!isFormComplete ? (
                <p className="text-xs text-sand-500">
                  Answer the remaining {remainingCount} questions to generate
                  your pack.
                </p>
              ) : null}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
