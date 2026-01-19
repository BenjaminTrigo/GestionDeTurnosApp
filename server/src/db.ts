import { Pool } from 'pg';
import dotenv from "dotenv";

dotenv.config();

const {PGUSER, PGHOST, PGDATABASE, PGPASSWORD} = process.env

const pool = new Pool({
    user: PGUSER,
    host: PGHOST,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: 5432,
    ssl: true,
});
console.log();
export const query = (text: string, params?: any[]) => pool.query(text,params);