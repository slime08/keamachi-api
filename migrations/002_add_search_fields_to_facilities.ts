import sql from '../lib/db';

async function migrate() {
  await sql`
    ALTER TABLE facilities
    ADD COLUMN IF NOT EXISTS transportation_available BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS service_area VARCHAR(255) DEFAULT '';
  `;
  console.log('Added transportation_available and service_area to facilities table.');
}

async function rollback() {
  await sql`
    ALTER TABLE facilities
    DROP COLUMN IF EXISTS transportation_available,
    DROP COLUMN IF EXISTS service_area;
  `;
  console.log('Dropped transportation_available and service_area from facilities table.');
}

if (require.main === module) {
  migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}

export { migrate, rollback };
