// export default {
//   schema: "./utils/schema.jsx",
//   dialect: "postgresql",
//   dbCredentials: {
//     url: "postgresql://attendance_owner:jg3zFbUuP8RH@ep-old-star-a5acyfpn.us-east-2.aws.neon.tech/attendance?sslmode=require",
//   },
// };

export default {
  schema: "./utils/schema.jsx",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    user: "postgres",
    password: "admin",
    database: "attendance_db",
    ssl: false,
  },
};
