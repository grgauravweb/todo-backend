// task.schema.js

// Define the task schema
export const TaskSchema = {
    name: {
        type: 'string',
        required: true,
        validate: (value) => typeof value === 'string' && value.trim().length > 0
    },
    complete: {
        type: 'boolean',
        required: true,
        validate: (value) => typeof value === 'boolean'
    }
};

// Function to validate a task against the schema
export const validateTask = (task) => {
    for (const key in TaskSchema) {
        const field = TaskSchema[key];

        if (field.required && !(key in task)) {
            return { valid: false, error: `${key} is required` };
        }

        if (!field.validate(task[key])) {
            return { valid: false, error: `${key} is invalid` };
        }
    }

    return { valid: true };
};
