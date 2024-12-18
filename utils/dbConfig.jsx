// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-http';
// const sql = neon('postgresql://attendance_owner:jg3zFbUuP8RH@ep-old-star-a5acyfpn.us-east-2.aws.neon.tech/attendance?sslmode=require');
// export const db = drizzle(sql,{schema});

import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "attendance_db",
  password: "admin",
  port: 5432,
});

client.connect().then(() => {
  console.log("DB COnnected Successfully");
});
export const db = drizzle(client);
