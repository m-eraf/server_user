const express = require('express');
const router = express.Router();
const User = require('../models/User');

const escapeRegExp = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Get paginated and filtered user list
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 20;
  const startIndex = (page - 1) * pageSize;

  const searchQuery = req.query.search;
  const domainFilter = req.query.domain;
  const genderFilter = req.query.gender;
  const availabilityFilter = req.query.availability;

  const searchRegex = new RegExp(searchQuery, 'i'); 

  try {
    let query = {};

    if (searchQuery) {
      query.$or = [
        { first_name: { $regex: searchRegex } },
        { last_name: { $regex: searchRegex } },
      ];
    }

    if (domainFilter) {
      // Use escapeRegExp for domain filter
      query.domain = { $regex: new RegExp(escapeRegExp(domainFilter), 'i') };
    }

    if (genderFilter) {
      query.gender = genderFilter;
    }

    if (availabilityFilter !== undefined) {
      query.available = availabilityFilter === 'true';
    }

    const users = await User.find(query).skip(startIndex).limit(pageSize);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users' });
  }
});

// Get all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;
