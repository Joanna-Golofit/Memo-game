const mongoose = require('mongoose');

const gameStateSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  players: [{
    name: String,
    avatar: String,
    score: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false }
  }],
  cards: [{ 
    cardId: String,
    isFlipped: { type: Boolean, default: false },
    isMatched: { type: Boolean, default: false },
    position: Number
  }],
  gamePhase: { 
    type: String, 
    enum: ['preview', 'playing', 'finished'], 
    default: 'preview' 
  },
  currentPlayer: { type: Number, default: 0 },
  turnTimeLeft: { type: Number, default: 25 },
  difficulty: { type: String, enum: ['easy'], default: 'easy' } // 4x4 for MVP
}, {
  timestamps: true
});

module.exports = mongoose.model('GameState', gameStateSchema);
