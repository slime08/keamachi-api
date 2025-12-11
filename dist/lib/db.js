"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
// keamachi-api/lib/db.ts
const postgres_1 = __importDefault(require("postgres"));
const connectionString = process.env.SUPABASE_URL;
if (!connectionString) {
    throw new Error('SUPABASE_URL is not set');
}
// Supabase Postgres client using 'postgres' library (supports tagged template literals)
const sql = (0, postgres_1.default)(connectionString, {
    ssl: { rejectUnauthorized: false }, // For Supabase, usually needed
});
// Export the sql function directly so migration files can use it as tagged template literal
exports.default = sql;
// For other parts of the API that might need a direct query function,
// we can also export a query wrapper if needed, but 'sql' itself can be used directly.
exports.query = sql;
