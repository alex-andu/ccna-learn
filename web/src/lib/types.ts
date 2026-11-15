export type Option = { id: string; text: string; correct: boolean; why: string };

type Base = {
  id: string;
  topicId: string;          // ex. "1.11"
  sub?: string;             // ex. "1.11.a"
  difficulty: 1 | 2 | 3;    // 1 ușor, 2 mediu, 3 greu
  stem: string;             // suportă markup Rich: [[termen]], **bold**, `code`
  explanation: string;      // explicația generală (conceptul din spate)
  tags?: string[];
};

export type ChoiceQuestion = Base & { type: 'single' | 'multi'; options: Option[] };
export type MatchQuestion = Base & {
  type: 'match';
  leftLabel?: string;
  rightLabel?: string;
  pairs: { left: string; right: string; why: string }[];
  distractors?: { text: string; why: string }[];
};
export type OrderQuestion = Base & { type: 'order'; items: { text: string; why: string }[] };
export type CliQuestion = Base & {
  type: 'cli';
  prompt: string;           // ex. "C:\\>" sau "Router(config-if)#"
  answers: string[];        // variante acceptate (normalizate la comparare)
  canonical: string;
  wrong: { text: string; why: string }[]; // greșeli frecvente + de ce sunt greșite
  hint?: string;
};
export type Question = ChoiceQuestion | MatchQuestion | OrderQuestion | CliQuestion;

export type Answer =
  | { type: 'single' | 'multi'; selected: string[] }
  | { type: 'match'; placement: Record<number, string | null> }
  | { type: 'order'; order: number[] }
  | { type: 'cli'; text: string };

export type GlossaryEntry = {
  id: string;
  abbr: string;        // ce apare în text: "SSID"
  full?: string;       // denumirea completă în engleză
  ro?: string;         // denumire/explicație scurtă în română
  what: string;        // ce face
  how: string;         // cum lucrează
  where: string;       // unde se folosește
  std?: string;        // standard / RFC
  layer?: string;      // nivel OSI
  topics?: string[];   // topic-uri CCNA legate
  aliases?: string[];
};

export type Mode = 'sim' | 'train' | 'fast';
