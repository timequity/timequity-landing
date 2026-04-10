import { randomUUID } from 'node:crypto';
import { db, Lead } from 'astro:db';

import type { ProbeResult } from '../probe';

export type LeadRecordInput = ProbeResult & {
  email: string;
};

export async function createLead(input: LeadRecordInput) {
  const record = {
    id: randomUUID(),
    created_at: new Date(),
    email: input.email.trim().toLowerCase(),
    entry_mode: input.entry_mode,
    runner: input.runner,
    primary_use_case: input.primary_use_case,
    primary_failure_mode: input.primary_failure_mode,
    strongest_area: input.strongest_area,
    weakest_area: input.weakest_area,
    recommended_mission: input.recommended_mission,
    readiness: input.readiness,
    source: 'landing_v1',
  };

  await db.insert(Lead).values(record);

  return record;
}
