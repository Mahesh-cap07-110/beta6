const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// Create Todo
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;
    
    const todo = new Todo({
      title,
      description,
      isPublic,
      userId: req.user.userId,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Read Todos
router.get('/', auth, async (req, res) => {
  try {
    const userTodos = await Todo.find({ userId: req.user.userId });
    const publicTodos = await Todo.find({ isPublic: true });
    
    res.json({ userTodos, publicTodos });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Todo
router.put('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.userId });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const { title, description, completed, isPublic } = req.body;
    
    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.completed = completed !== undefined ? completed : todo.completed;
    todo.isPublic = isPublic !== undefined ? isPublic : todo.isPublic;

    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete Todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;