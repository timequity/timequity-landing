export const siteContent = {
  meta: {
    title: 'Baseline Missions',
    description:
      'Run the baseline. Upgrade your agent. Mission-based training for coding agents and their operators.',
  },
  landing: {
    eyebrow: 'Operator baseline // dark route flow',
    headline: ['Run the baseline.', 'Upgrade your agent.'],
    subcopy:
      'Mission-based training for coding agents and their operators. Find weak spots, run missions, improve the runtime.',
    primaryCta: 'Run the baseline',
    secondaryCta: 'See how it works',
    chips: ['Claude Code', 'Codex', 'Gemini CLI', 'Browser only'],
    console: [
      '[baseline] mission profile ready',
      '[probe] 3 questions -> practical operator report',
      '[result] strongest area, weakest area, first mission',
      '[report] queued for dispatch',
    ],
    howItWorksTitle: 'How it works',
    howItWorksBody:
      'A short acquisition flow for operators who want grounded guidance instead of vanity scoring.',
    howItWorksSteps: [
      {
        index: '01',
        title: 'Take the baseline',
        body: 'Choose the entry mode and answer three short questions about runner, workload, and failure mode.',
      },
      {
        index: '02',
        title: 'Identify weak spots',
        body: 'The baseline maps your answers into the first practical issue to fix, not a generic persona label.',
      },
      {
        index: '03',
        title: 'Get the first mission',
        body: 'You get one recommended starting mission and a readiness level that an operator can actually use.',
      },
      {
        index: '04',
        title: 'Queue the report',
        body: 'Email capture happens after value is shown so the report can arrive with the first mission attached.',
      },
    ],
    missionsTitle: 'Optimize the runtime, not the model.',
    missionsBody:
      'Keep the loop practical: memory, plans, tool use, review discipline, and operator handoff.',
    missionCards: [
      {
        code: 'M_01',
        title: 'Memory architecture',
        body: 'Keep repo context and previous decisions stable across long-running edits.',
      },
      {
        code: 'M_02',
        title: 'Execution logic',
        body: 'Push plans into a repeatable edit -> verify -> review loop with bounded scope.',
      },
      {
        code: 'M_03',
        title: 'Tool selection',
        body: 'Choose the right tool path early instead of drifting between shell, code, and docs.',
      },
      {
        code: 'M_04',
        title: 'Evaluation pipeline',
        body: 'Add checks before trust. No test, no trust. No assertion, no confidence.',
      },
      {
        code: 'M_05',
        title: 'Review protocols',
        body: 'Catch risky diffs before they turn into runtime regressions or silent failures.',
      },
      {
        code: 'M_06',
        title: 'Operator interface',
        body: 'Make the next action obvious: what changed, what failed, what to run next.',
      },
    ],
    sprintTitle: 'Baseline sprint // 03',
    sprintBody:
      'A short operator mission pack: diagnose the loop, run the first fix, and queue the next dispatch.',
    sprintStats: [
      { label: 'Questions', value: '03' },
      { label: 'Signals', value: '06' },
      { label: 'Outcome', value: '01 mission' },
    ],
    closingTitle: 'Ready to optimize your agent?',
  },
  start: {
    eyebrow: 'System initialization',
    title: 'Choose how to start.',
    body: 'Pick the path that fits your setup. Each configuration is optimized for a specific technical environment.',
  },
  result: {
    title: 'Here’s where to start',
    supportNote: 'Good enough to move fast. Not reliable enough to trust unchecked changes.',
    cta: 'Send me the report',
  },
  report: {
    title: 'Send me the report',
    body: 'We’ll email your baseline result, your first mission, and occasional dispatch updates.',
    placeholder: 'operator@domain.com',
    cta: 'Send report',
    trustNote: 'No spam. One report, one mission, occasional updates.',
  },
  success: {
    badge: 'Report queued',
    title: 'Baseline received',
    body: 'Your report is on the way. We’ll send your first mission when it’s ready.',
    primaryCta: 'Open Dispatch',
    secondaryCta: 'Back to home',
    nextTitle: 'What happens next',
    nextSteps: ['Baseline report', 'First mission', 'Dispatch updates'],
  },
} as const;
