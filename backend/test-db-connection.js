const { Client } = require("pg");

async function testConnection() {
  // Load environment variables
  require("dotenv").config();

  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "edu_review_hub",
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            rejectUnauthorized: false,
          }
        : false,
  });

  try {
    console.log("🔌 Testing database connection...");
    console.log("Host:", process.env.DB_HOST || "localhost");
    console.log("Port:", process.env.DB_PORT || 5432);
    console.log("Database:", process.env.DB_DATABASE || "edu_review_hub");
    console.log("User:", process.env.DB_USERNAME || "postgres");
    console.log(
      "SSL:",
      process.env.NODE_ENV === "production" ? "enabled" : "disabled"
    );

    await client.connect();
    console.log("✅ Database connection successful!");

    const result = await client.query("SELECT NOW()");
    console.log("⏰ Current time:", result.rows[0].now);

    await client.end();
    console.log("🔌 Connection closed");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
