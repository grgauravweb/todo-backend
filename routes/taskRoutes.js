// routes/taskRoutes.js
const express = require("express");
const router = express.Router();

let tasks = []; // In-memory store for demonstration purposes

router.post("/tasks", (req, res) => {
  const { task } = req.body;
  if (!task || typeof task !== "string") {
    return res.status(400).json({ error: "Valid task content is required." });
  }
  const newTask = { _id: (tasks.length + 1).toString(), task };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

router.get("/tasks", (req, res) => {
  res.json(tasks);
});

router.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  if (!task || typeof task !== "string") {
    return res.status(400).json({ error: "Valid task content is required." });
  }
  const taskIndex = tasks.findIndex((t) => t._id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found." });
  }
  tasks[taskIndex] = { _id: id, task };
  res.json(tasks[taskIndex]);
});

router.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task._id !== id);
  res.status(204).send();
});

module.exports = router;
