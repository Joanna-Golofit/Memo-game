const mongoose = require('mongoose');
const Card = require('../models/Card');
require('dotenv').config();

// Sample data based on your mockups
const sampleCards = [
  // People
  { 
    id: 'boy', 
    name: 'Boy', 
    imagePath: '/uploads/images/boy.jpeg', 
    audioPath: '/uploads/audio/boy.mp3', 
    category: 'people' 
  },
  { 
    id: 'cat', 
    name: 'Cat', 
    imagePath: '/uploads/images/cat.jpeg', 
    audioPath: '/uploads/audio/cat.mp3', 
    category: 'objects' 
  },
  { 
    id: 'mum', 
    name: 'Mum', 
    imagePath: '/uploads/images/mum.jpeg', 
    audioPath: '/uploads/audio/mum.mp3', 
    category: 'people' 
  },
  { 
    id: 'grandpa', 
    name: 'Grandpa', 
    imagePath: '/uploads/images/grandpa.jpeg', 
    audioPath: '/uploads/audio/grandpa.mp3', 
    category: 'people' 
  },
  
  // Objects
  { 
    id: 'cupcake', 
    name: 'Cupcake', 
    imagePath: '/uploads/images/cupcake.jpeg', 
    audioPath: '/uploads/audio/cupcake.mp3', 
    category: 'objects' 
  },
  { 
    id: 'grandma', 
    name: 'Grandma', 
    imagePath: '/uploads/images/grandma.jpeg', 
    audioPath: '/uploads/audio/grandma.mp3', 
    category: 'people' 
  },
  
  // Colors/Shapes
  { 
    id: 'green', 
    name: 'Green', 
    imagePath: '/uploads/images/green.jpeg', 
    audioPath: '/uploads/audio/green.mp3', 
    category: 'colors' 
  },
  { 
    id: 'yellow', 
    name: 'Yellow', 
    imagePath: '/uploads/images/yellow.jpeg', 
    audioPath: '/uploads/audio/yellow.mp3', 
    category: 'colors' 
  },
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