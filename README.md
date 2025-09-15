# Memory Game 🎮

Multiplayer memory card game with audio support for learning and fun.

## ✨ Features
- 🎯 **4x4 grid** (8 pairs of cards)
- 👥 **2 players** with scoring system
- ⏱️ **25 second turns** with timer
- 🎵 **Audio pronunciation** for each card
- 📱 **Categories**: People, Objects, Colors
- 🗄️ **MongoDB storage** for game state
- 🚀 **RESTful API** with Express.js

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js, MongoDB
- **Database**: MongoDB with Mongoose
- **Audio**: Multer for file uploads

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB running locally (https://cloud.mongodb.com/v2...)
- Git

### Installation
1. Clone repository
   ```bash
   git clone https://github.com/Joanna-Golofit/memory.git
   cd memory
   ```

2. Set up environment
   ```bash
   cd backend
   cp config.txt .env
   npm install
   ```

3. Start MongoDB and seed database
   ```bash
   npm run seed
   ```

4. Start development server
   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000/api/health`

## 📡 API Endpoints
- `GET /api/health` - Health check
- `GET /api/cards` - Get all active cards
- `GET /api/cards/category/:category` - Get cards by category
- `GET /api/cards/random/:count` - Get random cards for game
- `POST /api/game/new` - Create new game
- `GET /api/game/:gameId` - Get game state
- `POST /api/game/:gameId/move` - Make a move
- `POST /api/game/:gameId/switch-turn` - Switch player turn

## 📁 Project Structure
```
memory/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── scripts/         # Database seeding
│   ├── uploads/         # Media files (images/audio)
│   ├── server.js        # Main server file
│   └── package.json
├── .gitignore
└── README.md
```

## 🎯 Game Rules
1. Players take turns (25 seconds each)
2. Flip 2 cards per turn
3. Match pairs to score points
4. Player with most pairs wins!

## 🔮 Future Plans
- [ ] Frontend React app
- [ ] Real-time multiplayer with WebSockets
- [ ] More difficulty levels
- [ ] User accounts and statistics
- [ ] Mobile app

## 👩‍💻 Author
**Joanna Gołofit** - Frontend Developer  
- LinkedIn: [joanna-gołofit](https://linkedin.com/in/joanna-go%C5%82ofit-2a8b02205)
- Portfolio: [joanna-golofit-cv.netlify.app](https://joanna-golofit-cv.netlify.app)

## 📄 License
MIT License - feel free to use this project for learning!

sounds from: https://ttsmp3.com/
pictures: https://leonardo.ai