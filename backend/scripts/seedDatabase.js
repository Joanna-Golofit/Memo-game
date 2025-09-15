const mongoose = require('mongoose');
const Card = require('../models/Card');
require('dotenv').config();

// Sample data based on your mockups
const sampleCards = [
  // === ISTNIEJĄCE KARTY DEFAULT ===
  { 
    id: 'boy', 
    name: 'Boy', 
    imagePath: '/uploads/images/default/boy.jpg', 
    audioPath: '/uploads/audio/default/boy.mp3', 
    category: 'default',  // ← ZMIEŃ NA 'default'
    isActive: true  
  },
  { 
    id: 'cat', 
    name: 'Cat', 
    imagePath: '/uploads/images/default/cat.jpg', 
    audioPath: '/uploads/audio/default/cat.mp3', 
    category: 'default',  // ← ZMIEŃ NA 'default'
    isActive: true  
  },
  { 
    id: 'mum', 
    name: 'Mum', 
    imagePath: '/uploads/images/default/mum.jpg', 
    audioPath: '/uploads/audio/default/mum.mp3', 
    category: 'default',  // ← ZMIEŃ NA 'default'
    isActive: true
  },
  { 
    id: 'grandpa', 
    name: 'Grandpa', 
    imagePath: '/uploads/images/default/grandpa.jpeg', 
    audioPath: '/uploads/audio/default/grandpa.mp3', 
    category: 'default',  // ← ZMIEŃ NA 'default'
    isActive: true
  },
  { 
    id: 'cupcake', 
    name: 'Cupcake', 
    imagePath: '/uploads/images/default/cupcake.jpg', 
    audioPath: '/uploads/audio/default/cupcake.mp3', 
    category: 'default',  // ← ZMIEŃ NA 'default'
    isActive: true
  },
  { 
    id: 'grandma', 
    name: 'Grandma', 
    imagePath: '/uploads/images/default/grandma.jpg', 
    audioPath: '/uploads/audio/default/grandma.mp3', 
    category: 'default',  // ← ZMIEŃ NA 'default'
    isActive: true
  },
  { 
    id: 'green', 
    name: 'Green', 
    imagePath: '/uploads/images/default/green.jpg', 
    audioPath: '/uploads/audio/default/green.mp3', 
    category: 'default',  // ← ZMIEŃ NA 'default'
    isActive: true
  },
  { 
    id: 'yellow', 
    name: 'Yellow', 
    imagePath: '/uploads/images/default/yellow.jpg', 
    audioPath: '/uploads/audio/default/yellow.mp3', 
    category: 'default',  // ← ZMIEŃ NA 'default'
    isActive: true
  },

  // === NOWE KARTY ZWIERZĄT ===
  { 
    id: 'dog', 
    name: 'Dog', 
    imagePath: '/uploads/images/animals/dog.jpg', 
    audioPath: '/uploads/audio/animals/dog.mp3', 
    category: 'animals',
    isActive: true  
  },
  { 
    id: 'goldfish', 
    name: 'Goldfish', 
    imagePath: '/uploads/images/animals/goldfish.jpg', 
    audioPath: '/uploads/audio/animals/goldfish.mp3', 
    category: 'animals',
    isActive: true  
  },
  { 
    id: 'hamster', 
    name: 'Hamster', 
    imagePath: '/uploads/images/animals/hamster.png', 
    audioPath: '/uploads/audio/animals/hamster.mp3', 
    category: 'animals',
    isActive: true
  },
  { 
    id: 'mantis', 
    name: 'Mantis', 
    imagePath: '/uploads/images/animals/mantis.jpg', 
    audioPath: '/uploads/audio/animals/mantis.mp3', 
    category: 'animals',
    isActive: true
  },
  { 
    id: 'mouse', 
    name: 'Mouse', 
    imagePath: '/uploads/images/animals/mouse.jpg', 
    audioPath: '/uploads/audio/animals/mouse.mp3', 
    category: 'animals',
    isActive: true
  },
  { 
    id: 'parrot', 
    name: 'Parrot', 
    imagePath: '/uploads/images/animals/parrot.jpg', 
    audioPath: '/uploads/audio/animals/parrot.mp3', 
    category: 'animals',
    isActive: true
  },
  { 
    id: 'rabbit', 
    name: 'Rabbit', 
    imagePath: '/uploads/images/animals/rabbit.jpg', 
    audioPath: '/uploads/audio/animals/rabbit.mp3', 
    category: 'animals',
    isActive: true
  },
  { 
    id: 'snake', 
    name: 'Snake', 
    imagePath: '/uploads/images/animals/snake.jpg', 
    audioPath: '/uploads/audio/animals/snake.mp3', 
    category: 'animals',
    isActive: true
  },
  { 
    id: 'turtle', 
    name: 'Turtle', 
    imagePath: '/uploads/images/animals/turtle.jpg', 
    audioPath: '/uploads/audio/animals/turtle.mp3', 
    category: 'animals',
    isActive: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/memorygame');
    console.log('🔌 Connected to MongoDB');
    
    // Clear existing cards
    await Card.deleteMany({});
    console.log('🗑️  Cleared existing cards');
    
    // Insert sample cards
    await Card.insertMany(sampleCards);
    console.log('✅ Sample cards inserted successfully!');
    console.log(`📊 Total cards: ${sampleCards.length}`);
    
    // Show inserted cards
    const cards = await Card.find({});
    console.log('\n📋 Cards in database:');
    cards.forEach(card => {
      console.log(`   - ${card.name} (${card.category})`);
    });
    
    mongoose.connection.close();
    console.log('\n🎮 Database seeded and connection closed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();