import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(__dirname, '../migrations');

const legacyObjects = {
  '001_create_users.sql': [['table', 'users']],
  '002_create_profiles.sql': [['table', 'profiles']],
  '003_create_family_members.sql': [['table', 'family_members']],
  '004_create_connections.sql': [['table', 'connections']],
  '005_create_messages.sql': [['table', 'messages']],
  '006_create_notifications.sql': [['table', 'notifications']],
  '007_create_payments.sql': [['table', 'payments']],
  '008_create_otps.sql': [['table', 'otps']],
  '009_add_users_is_admin.sql': [['column', 'users', 'is_admin']],
  '010_add_users_is_active.sql': [['column', 'users', 'is_active']],
  '011_create_reports.sql': [['table', 'reports']],
  '012_create_contact_messages.sql': [['table', 'contact_messages']],
  '013_create_success_stories.sql': [['table', 'success_stories']],
};

async function objectExists(connection, object) {
  const [kind, table, column] = object;
  if (kind === 'table') {
    const [rows] = await connection.query(
      `SELECT 1 FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? LIMIT 1`,
      [table]
    );
    return rows.length > 0;
  }

  const [rows] = await connection.query(
    `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1`,
    [table, column]
  );
  return rows.length > 0;
}

async function runMigrations() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const files = (await fs.readdir(migrationsDir))
      .filter((file) => file.endsWith('.sql'))
      .sort();
    const [appliedRows] = await connection.query('SELECT name FROM schema_migrations');
    const applied = new Set(appliedRows.map((row) => row.name));

    for (const file of files) {
      if (applied.has(file)) continue;

      const legacyChecks = legacyObjects[file];
      if (legacyChecks && (await Promise.all(legacyChecks.map((item) => objectExists(connection, item)))).every(Boolean)) {
        await connection.query('INSERT INTO schema_migrations (name) VALUES (?)', [file]);
        console.log(`Marked existing schema as applied: ${file}`);
        continue;
      }

      const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
      await connection.query(sql);
      await connection.query('INSERT INTO schema_migrations (name) VALUES (?)', [file]);
      console.log(`Applied: ${file}`);
    }

    console.log('Database migrations are up to date.');
  } finally {
    connection.release();
    await pool.end();
  }
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exitCode = 1;
});
