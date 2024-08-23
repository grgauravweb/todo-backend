// controllers/taskController.js
const taskModel = require("../models/taskModel");

// Create a new task
async function createTask(req, res) {
  const { id, task } = req.body;
  if (!id || !task) {
    return res
      .status(400)
      .json({ error: "ID and task description are required." });
  }

  try {
    await taskModel.createTask(id, task);
    res.status(201).json({ message: "Task created successfully." });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Get a specific task by ID
async function getTask(req, res) {
  const { id } = req.params;

  try {
    const task = await taskModel.getTask(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.status(200).json({ id, task });
  } catch (error) {
    console.error("Error retrieving task:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Update a task by ID
async function updateTask(req, res) {
  const { id } = req.params;
  const { task } = req.body;

  if (!task) {
    return res
      .status(400)
      .json({ error: "Task description is required for update." });
  }

  try {
    const updated = await taskModel.updateTask(id, task);
    if (!updated) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.status(200).json({ message: "Task updated successfully." });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Delete a task by ID
async function deleteTask(req, res) {
  const { id } = req.params;

  try {
    const deleted = await taskModel.deleteTask(id);
    if (!deleted) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Get all tasks
async function getAllTasks(req, res) {
  try {
    const tasks = await taskModel.getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getAllTasks,
};
