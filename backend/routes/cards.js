const express = require('express');
const router = express.Router();
const Card = require('../models/Card');

// Get all active cards
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find({ isActive: true });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get cards by category
router.get('/category/:category', async (req, res) => {
  try {
    const cards = await Card.find({ 
      category: req.params.category, 
      isActive: true 
    });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get random cards for game (8 pairs = 16 cards for 4x4)
router.get('/random/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 8;
    const cards = await Card.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: count } }
    ]);
    
    // Create pairs
    const pairs = [...cards, ...cards].map((card, index) => ({
      ...card,
      position: index,
      isFlipped: false,
      isMatched: false
    }));
    
    // Shuffle pairs
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    
    res.json(pairs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
