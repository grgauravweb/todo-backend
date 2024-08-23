// models/taskModel.js
const client = require("../database/redis");

const TASKS_KEY = "tasks"; // Redis hash key to store all tasks

// Create a new task
async function createTask(id, task) {
  await client.hSet(TASKS_KEY, id, task);
}

// Retrieve a task by ID
async function getTask(id) {
  return await client.hGet(TASKS_KEY, id);
}

// Update a task by ID
async function updateTask(id, task) {
  const exists = await client.hExists(TASKS_KEY, id);
  if (exists) {
    await client.hSet(TASKS_KEY, id, task);
    return true;
  }
  return false;
}

// Delete a task by ID
async function deleteTask(id) {
  const result = await client.hDel(TASKS_KEY, id);
  return result > 0;
}

// Retrieve all tasks
async function getAllTasks() {
  const tasks = await client.hGetAll(TASKS_KEY);
  return Object.entries(tasks).map(([id, task]) => ({ id, task }));
}

module.exports = {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getAllTasks,
};
