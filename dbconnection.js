

const { Pool } = require('pg');


const connectionString = 'postgresql://postgres:Sidhunodejs@db.kbsrsjsvbcwbznwyprrj.supabase.co:5432/postgres';

const pool = new Pool({
  connectionString: connectionString,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
