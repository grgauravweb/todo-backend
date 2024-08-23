const redis = require("redis");

require("dotenv").config();

const client = redis.createClient({
  url: process.env.DB,
  legacyMode: false, // Use modern async methods
});

client
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Redis connection error:", err);
  });

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

module.exports = client;
