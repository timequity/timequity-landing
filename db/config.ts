import { NOW, column, defineDb, defineTable } from 'astro:db';

const Lead = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    created_at: column.date({ default: NOW }),
    email: column.text(),
    entry_mode: column.text(),
    runner: column.text(),
    primary_use_case: column.text(),
    primary_failure_mode: column.text(),
    strongest_area: column.text(),
    weakest_area: column.text(),
    recommended_mission: column.text(),
    readiness: column.text(),
    source: column.text({ default: 'landing_v1' }),
  },
});

export default defineDb({
  tables: {
    Lead,
  },
});
