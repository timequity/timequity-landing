import { defineAction } from 'astro:actions';

import { createLead } from '../lib/persistence/leads';
import { deriveProbeResult, probeInputSchema, reportSubmissionSchema } from '../lib/probe';

export const server = {
  probe: {
    generate: defineAction({
      accept: 'form',
      input: probeInputSchema,
      handler: async (input) => deriveProbeResult(input),
    }),
  },
  report: {
    submit: defineAction({
      accept: 'form',
      input: reportSubmissionSchema,
      handler: async (input) => {
        const result = deriveProbeResult(input);
        const lead = await createLead({
          ...result,
          email: input.email,
        });

        return {
          id: lead.id,
          email: lead.email,
        };
      },
    }),
  },
};
