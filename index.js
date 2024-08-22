import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';
import { validateTask } from './schema/task.schema.js';

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://todo-frontend-dun-gamma.vercel.app']
}));

// Create Redis client and connect to the cloud Redis server
const redisClient = createClient({
    url: 'redis://gaurav:Gaurav@123@redis-13019.c305.ap-south-1-1.ec2.redns.redis-cloud.com:13019',
    password: 'Gaurav@123'
});

redisClient.connect()
    .then(() => console.log("Connected to Redis"))
    .catch(err => console.error("Redis connection error:", err));

// Generate a unique ID for tasks
const generateId = () => `task:${Math.random().toString(36).substr(2, 9)}`;

// Create a new task
app.post('/tasks', async (req, res) => {
    const { name, complete = false } = req.body;
    const task = { name, complete };

    // Validate task against schema
    const validation = validateTask(task);
    if (!validation.valid) {
        return res.status(400).send({ error: validation.error });
    }

    const id = generateId();
    
    // Use hSet with correct arguments
    await redisClient.hSet(id, 'name', task.name, 'complete', task.complete.toString());

    res.status(201).send({ id: id.replace('task:', ''), ...task });  // Remove 'task:' prefix from response
});

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const keys = await redisClient.keys('task:*');
        const tasks = [];

        for (const key of keys) {
            const task = await redisClient.hGetAll(key);

            // Remove 'task:' prefix from the ID
            const taskId = key.replace('task:', '');

            tasks.push({ id: taskId, ...task });
        }

        res.send(tasks);
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).send('Error retrieving tasks');
    }
});

// Update task completion status
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { name, complete } = req.body;

    // Prepare update fields
    const updateFields = {};

    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim() === '') {
            return res.status(400).send({ error: 'Name must be a non-empty string' });
        }
        updateFields.name = name;
    }

    if (complete !== undefined) {
        if (typeof complete !== 'boolean') {
            return res.status(400).send({ error: 'Complete field must be a boolean' });
        }
        updateFields.complete = complete.toString();
    }

    // Add 'task:' prefix to the ID
    const redisId = `task:${id}`;

    // Update fields in Redis
    if (Object.keys(updateFields).length > 0) {
        await redisClient.hSet(redisId, updateFields);
    }

    res.send({ id, ...updateFields });
});



// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    // Add 'task:' prefix to the ID
    const redisId = `task:${id}`;

    // Delete the task from Redis
    await redisClient.del(redisId);
    res.status(204).send();
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
