"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = migrate;
exports.rollback = rollback;
const db_1 = __importDefault(require("../lib/db"));
async function migrate() {
    await (0, db_1.default) `
    CREATE TABLE IF NOT EXISTS facilities (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      services TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
    console.log('Facilities table created or already exists.');
}
async function rollback() {
    await (0, db_1.default) `
    DROP TABLE IF EXISTS facilities;
  `;
    console.log('Facilities table dropped.');
}
// 繝槭う繧ｰ繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ螳溯｡檎畑縺ｮ繧ｹ繧ｯ繝ｪ繝励ヨ
if (require.main === module) {
    migrate().catch(err => {
        console.error('Migration failed:', err);
        process.exit(1);
    });
}
