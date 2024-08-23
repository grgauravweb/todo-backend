const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const client = require("./database/redis"); // Ensures Redis client is initialized

const app = express();

// Middleware to enable CORS
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:4000"] }));

// Middleware to parse JSON request bodies
app.use(express.json());

// Use task routes with a base path (e.g., /api)
app.use("/api", taskRoutes);

// Root route (optional)
app.get("/", (req, res) => {
  res.send("Welcome to the To-Do App API!");
});

// Start the server
const PORT = process.env.PORT || 4000; // Default to 4000 if PORT is not set
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  client
    .quit()
    .then(() => {
      console.log("Redis connection closed.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error during Redis disconnection:", err);
      process.exit(1);
    });
});
