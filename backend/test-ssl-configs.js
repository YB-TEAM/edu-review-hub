const { Client } = require("pg");

async function testDataSourceConfig() {
  console.log("🔍 Testing data-source.ts SSL configuration...");

  // Simulate data-source.ts config
  const dataSourceConfig = {
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
  };

  console.log("SSL Config:", dataSourceConfig.ssl);
  return dataSourceConfig;
}

async function testDatabaseConfig() {
  console.log("🔍 Testing database.config.ts SSL configuration...");

  // Simulate database.config.ts config
  const databaseConfig = {
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
    extra: {
      ssl:
        process.env.NODE_ENV === "production"
          ? {
              rejectUnauthorized: false,
            }
          : false,
    },
  };

  console.log("SSL Config:", databaseConfig.ssl);
  console.log("Extra SSL Config:", databaseConfig.extra.ssl);
  return databaseConfig;
}

async function testConnection(config, name) {
  const client = new Client(config);

  try {
    console.log(`🔌 Testing ${name} connection...`);
    await client.connect();
    console.log(`✅ ${name} connection successful!`);

    const result = await client.query("SELECT NOW()");
    console.log(`⏰ Current time: ${result.rows[0].now}`);

    await client.end();
    console.log(`🔌 ${name} connection closed`);
    return true;
  } catch (error) {
    console.error(`❌ ${name} connection failed:`, error.message);
    return false;
  }
}

async function main() {
  require("dotenv").config();

  console.log("🧪 Testing SSL Configurations...");
  console.log("Environment:", process.env.NODE_ENV || "development");
  console.log("DB_SSL:", process.env.DB_SSL || "not set");
  console.log("");

  const dataSourceConfig = await testDataSourceConfig();
  const databaseConfig = await testDatabaseConfig();

  console.log("");
  console.log("🔌 Testing connections...");
  console.log("");

  const dataSourceSuccess = await testConnection(
    dataSourceConfig,
    "data-source.ts"
  );
  const databaseSuccess = await testConnection(
    databaseConfig,
    "database.config.ts"
  );

  console.log("");
  if (dataSourceSuccess && databaseSuccess) {
    console.log("🎉 All configurations are working!");
  } else {
    console.log("⚠️  Some configurations have issues");
  }
}

main().catch(console.error);
