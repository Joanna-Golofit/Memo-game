const mongoose = require('mongoose');
const Card = require('../models/Card');

// Sample data based on your mockups
const sampleCards = [
  // People
  { 
    id: 'boy1', 
    name: 'Boy', 
    imagePath: '/uploads/images/boy1.png', 
    audioPath: '/uploads/audio/boy1.mp3', 
    category: 'people' 
  },
  { 
    id: 'girl1', 
    name: 'Girl', 
    imagePath: '/uploads/images/girl1.png', 
    audioPath: '/uploads/audio/girl1.mp3', 
    category: 'people' 
  },
  { 
    id: 'woman1', 
    name: 'Woman', 
    imagePath: '/uploads/images/woman1.png', 
    audioPath: '/uploads/audio/woman1.mp3', 
    category: 'people' 
  },
  { 
    id: 'man1', 
    name: 'Man', 
    imagePath: '/uploads/images/man1.png', 
    audioPath: '/uploads/audio/man1.mp3', 
    category: 'people' 
  },
  
  // Objects
  { 
    id: 'cup1', 
    name: 'Cup', 
    imagePath: '/uploads/images/cup1.png', 
    audioPath: '/uploads/audio/cup1.mp3', 
    category: 'objects' 
  },
  { 
    id: 'house1', 
    name: 'House', 
    imagePath: '/uploads/images/house1.png', 
    audioPath: '/uploads/audio/house1.mp3', 
    category: 'objects' 
  },
  
  // Colors/Shapes
  { 
    id: 'splash_pink', 
    name: 'Pink Splash', 
    imagePath: '/uploads/images/splash_pink.png', 
    audioPath: '/uploads/audio/splash_pink.mp3', 
    category: 'colors' 
  },
  { 
    id: 'splash_blue', 
    name: 'Blue Splash', 
    imagePath: '/uploads/images/splash_blue.png', 
    audioPath: '/uploads/audio/splash_blue.mp3', 
    category: 'colors' 
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/memorygame');
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
