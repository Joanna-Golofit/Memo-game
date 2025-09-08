const express = require('express');
const router = express.Router();
const GameState = require('../models/GameState');
const Card = require('../models/Card');

// Create new game
router.post('/new', async (req, res) => {
  try {
    const { player1Name, player2Name } = req.body;
    
    // Get random cards for game
    const cards = await Card.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: 8 } }
    ]);
    
    // Create pairs and shuffle
    const gamePairs = [...cards, ...cards].map((card, index) => ({
      cardId: card._id,
      isFlipped: false,
      isMatched: false,
      position: index
    }));
    
    // Shuffle
    for (let i = gamePairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gamePairs[i], gamePairs[j]] = [gamePairs[j], gamePairs[i]];
    }
    
    const gameState = new GameState({
      gameId: Date.now().toString(),
      players: [
        { name: player1Name || 'Inka', avatar: 'fairy', score: 0, isActive: true },
        { name: player2Name || 'Gabriel', avatar: 'boy1', score: 0, isActive: false }
      ],
      cards: gamePairs,
      gamePhase: 'preview',
      currentPlayer: 0,
      turnTimeLeft: 25
    });
    
    await gameState.save();
    res.json(gameState);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get game state
router.get('/:gameId', async (req, res) => {
  try {
    const gameState = await GameState.findOne({ 
      gameId: req.params.gameId 
    }).populate('cards.cardId');
    
    if (!gameState) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json(gameState);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Make move
router.post('/:gameId/move', async (req, res) => {
  try {
    const { position } = req.body;
    const gameState = await GameState.findOne({ 
      gameId: req.params.gameId 
    });
    
    if (!gameState) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Flip card
    gameState.cards[position].isFlipped = true;
    
    // Check for matches, update scores, etc.
    // (Logic will be implemented in frontend for MVP)
    
    await gameState.save();
    res.json(gameState);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Switch player turn
router.post('/:gameId/switch-turn', async (req, res) => {
  try {
    const gameState = await GameState.findOne({ 
      gameId: req.params.gameId 
    });
    
    if (!gameState) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Switch active player
    gameState.currentPlayer = gameState.currentPlayer === 0 ? 1 : 0;
    gameState.players[0].isActive = gameState.currentPlayer === 0;
    gameState.players[1].isActive = gameState.currentPlayer === 1;
    gameState.turnTimeLeft = 25;
    
    await gameState.save();
    res.json(gameState);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
