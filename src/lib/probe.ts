import { z } from 'zod';

export const entryModeValues = ['agent', 'terminal', 'web'] as const;
export const runnerValues = ['Claude Code', 'Codex', 'Gemini CLI', 'Browser only', 'Other'] as const;
export const primaryUseCaseValues = ['Code edits', 'Refactors', 'Research', 'Automation', 'Mixed'] as const;
export const primaryFailureModeValues = [
  'Loses context',
  'Weak plans',
  'Weak tool use',
  'Weak review',
  'Unreliable output',
  'Not sure yet',
] as const;

export const strongestAreaValues = [
  'Repo navigation',
  'Tool routing',
  'Source synthesis',
  'Task framing',
  'Operator handoff',
] as const;
export const weakestAreaValues = [
  'Memory discipline',
  'Planning quality',
  'Tool execution',
  'Review discipline',
  'Verification loop',
  'Baseline clarity',
] as const;
export const recommendedMissionValues = [
  'Plans + eval loop',
  'Memory + checkpoints',
  'Tool routing drills',
  'Review + diff discipline',
  'Assertions + rollback',
  'Operator baseline run',
] as const;
export const readinessValues = ['Low', 'Medium', 'High'] as const;

export type EntryMode = (typeof entryModeValues)[number];
export type Runner = (typeof runnerValues)[number];
export type PrimaryUseCase = (typeof primaryUseCaseValues)[number];
export type PrimaryFailureMode = (typeof primaryFailureModeValues)[number];
export type StrongestArea = (typeof strongestAreaValues)[number];
export type WeakestArea = (typeof weakestAreaValues)[number];
export type RecommendedMission = (typeof recommendedMissionValues)[number];
export type Readiness = (typeof readinessValues)[number];

export type ProbeInput = {
  entry_mode: EntryMode;
  runner: Runner;
  primary_use_case: PrimaryUseCase;
  primary_failure_mode: PrimaryFailureMode;
};

export type ProbeResult = ProbeInput & {
  strongest_area: StrongestArea;
  weakest_area: WeakestArea;
  recommended_mission: RecommendedMission;
  readiness: Readiness;
  support_note: string;
  report_id: string;
};

export const entryModeOptions: Array<{
  value: EntryMode;
  label: string;
  code: string;
  description: string;
}> = [
  {
    value: 'agent',
    label: 'Use your agent',
    code: 'PATH_01',
    description:
      'Best if you already work in Claude Code, Codex, or Gemini CLI. Start from your current operating loop.',
  },
  {
    value: 'terminal',
    label: 'Open terminal flow',
    code: 'PATH_02',
    description: 'Follow the baseline in a terminal-native path with the shortest route from signal to first mission.',
  },
  {
    value: 'web',
    label: 'Quick web path',
    code: 'PATH_03',
    description: 'Fastest way to preview the baseline in-browser with zero setup and a shorter entry loop.',
  },
];

export const runnerOptions = runnerValues.map((value) => ({ value, label: value }));
export const primaryUseCaseOptions = primaryUseCaseValues.map((value) => ({ value, label: value }));
export const primaryFailureModeOptions = primaryFailureModeValues.map((value) => ({ value, label: value }));

export const probeInputSchema = z.object({
  entry_mode: z.enum(entryModeValues, { message: 'Choose a path before continuing.' }),
  runner: z.enum(runnerValues, { message: 'Choose the runner you use most often.' }),
  primary_use_case: z.enum(primaryUseCaseValues, { message: 'Choose the main job for your agent.' }),
  primary_failure_mode: z.enum(primaryFailureModeValues, { message: 'Choose where it fails most often.' }),
});

export const reportSubmissionSchema = probeInputSchema.extend({
  email: z.string().trim().min(1, 'Enter an email address.').email('Enter a valid email address.'),
});

const strongestByRunner: Record<Runner, StrongestArea> = {
  'Claude Code': 'Tool routing',
  Codex: 'Repo navigation',
  'Gemini CLI': 'Source synthesis',
  'Browser only': 'Operator handoff',
  Other: 'Task framing',
};

const strongestByUseCase: Record<PrimaryUseCase, StrongestArea> = {
  'Code edits': 'Repo navigation',
  Refactors: 'Repo navigation',
  Research: 'Source synthesis',
  Automation: 'Tool routing',
  Mixed: 'Task framing',
};

const weakestByFailure: Record<PrimaryFailureMode, WeakestArea> = {
  'Loses context': 'Memory discipline',
  'Weak plans': 'Planning quality',
  'Weak tool use': 'Tool execution',
  'Weak review': 'Review discipline',
  'Unreliable output': 'Verification loop',
  'Not sure yet': 'Baseline clarity',
};

const missionByFailure: Record<PrimaryFailureMode, RecommendedMission> = {
  'Loses context': 'Memory + checkpoints',
  'Weak plans': 'Plans + eval loop',
  'Weak tool use': 'Tool routing drills',
  'Weak review': 'Review + diff discipline',
  'Unreliable output': 'Assertions + rollback',
  'Not sure yet': 'Operator baseline run',
};

const strongestAreaDescriptions: Record<StrongestArea, string> = {
  'Repo navigation': 'Finds the right files and local context quickly enough to keep edits moving.',
  'Tool routing': 'Knows when to switch between shell, code, and docs without wasting the loop.',
  'Source synthesis': 'Pulls useful information out of multiple sources without losing the thread.',
  'Task framing': 'Can turn vague work into a bounded next action without much operator overhead.',
  'Operator handoff': 'Keeps the visible flow simple enough for an operator to stay oriented.',
};

const weakestAreaDescriptions: Record<WeakestArea, string> = {
  'Memory discipline': 'Context slips between steps, so later edits lose the rationale behind earlier ones.',
  'Planning quality': 'The plan is not carrying enough structure into execution and review.',
  'Tool execution': 'The loop picks the wrong tool or uses the right one too late.',
  'Review discipline': 'Changes move faster than validation, so avoidable regressions slip through.',
  'Verification loop': 'Outputs look done before they have enough checks behind them.',
  'Baseline clarity': 'The current loop needs one explicit baseline before it can be optimized confidently.',
};

const readinessScore: Record<Readiness, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

export function deriveProbeResult(input: ProbeInput): ProbeResult {
  const strongest_area = deriveStrongestArea(input);
  const weakest_area = weakestByFailure[input.primary_failure_mode];
  const recommended_mission = missionByFailure[input.primary_failure_mode];
  const readiness = deriveReadiness(input);

  return {
    ...input,
    strongest_area,
    weakest_area,
    recommended_mission,
    readiness,
    support_note: 'Good enough to move fast. Not reliable enough to trust unchecked changes.',
    report_id: buildReportId(input),
  };
}

function deriveStrongestArea(input: ProbeInput): StrongestArea {
  if (input.primary_use_case === 'Mixed') {
    return strongestByRunner[input.runner] === 'Operator handoff' ? 'Task framing' : strongestByRunner[input.runner];
  }

  if (input.runner === 'Browser only') {
    return 'Operator handoff';
  }

  if (input.runner === 'Gemini CLI' && input.primary_use_case === 'Research') {
    return 'Source synthesis';
  }

  return strongestByUseCase[input.primary_use_case] ?? strongestByRunner[input.runner];
}

function deriveReadiness(input: ProbeInput): Readiness {
  if (input.runner === 'Browser only') {
    return 'Low';
  }

  if (input.primary_failure_mode === 'Not sure yet') {
    return 'Low';
  }

  if (input.primary_use_case === 'Mixed') {
    return input.primary_failure_mode === 'Unreliable output' ? 'Low' : 'Medium';
  }

  if (input.primary_use_case === 'Research' && input.runner === 'Gemini CLI' && input.primary_failure_mode === 'Loses context') {
    return 'Medium';
  }

  if (input.primary_use_case === 'Automation' && input.primary_failure_mode === 'Weak review') {
    return 'Medium';
  }

  if (input.primary_use_case === 'Automation' && input.primary_failure_mode === 'Weak tool use') {
    return 'Medium';
  }

  if (input.primary_failure_mode === 'Unreliable output') {
    return 'Medium';
  }

  if (input.primary_use_case === 'Research') {
    return 'High';
  }

  return 'Medium';
}

export function buildProbeSearchParams(input: ProbeInput): URLSearchParams {
  return new URLSearchParams({
    entry_mode: input.entry_mode,
    runner: input.runner,
    primary_use_case: input.primary_use_case,
    primary_failure_mode: input.primary_failure_mode,
  });
}

export function parseProbeInput(searchParams: URLSearchParams): ProbeInput | null {
  const parsed = probeInputSchema.safeParse({
    entry_mode: searchParams.get('entry_mode') ?? undefined,
    runner: searchParams.get('runner') ?? undefined,
    primary_use_case: searchParams.get('primary_use_case') ?? undefined,
    primary_failure_mode: searchParams.get('primary_failure_mode') ?? undefined,
  });

  return parsed.success ? parsed.data : null;
}

export function getEntryModeMeta(entryMode: EntryMode) {
  return entryModeOptions.find((option) => option.value === entryMode)!;
}

export function getStrongestAreaDescription(value: StrongestArea) {
  return strongestAreaDescriptions[value];
}

export function getWeakestAreaDescription(value: WeakestArea) {
  return weakestAreaDescriptions[value];
}

export function getReadinessSegments(readiness: Readiness) {
  const activeSegments = readinessScore[readiness];
  return Array.from({ length: 3 }, (_, index) => index < activeSegments);
}

function buildReportId(input: ProbeInput) {
  const fragments = [input.runner, input.primary_use_case, input.primary_failure_mode]
    .map((value) => value.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'NA')
    .join('-');

  return `BL-${fragments}`;
}
