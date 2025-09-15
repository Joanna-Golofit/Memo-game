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
    category: 'default',
    isActive: true  
  },
  { 
    id: 'cat', 
    name: 'Cat', 
    imagePath: '/uploads/images/default/cat.jpg', 
    audioPath: '/uploads/audio/default/cat.mp3', 
    category: 'default',
    isActive: true  
  },
  { 
    id: 'mum', 
    name: 'Mum', 
    imagePath: '/uploads/images/default/mum.jpg', 
    audioPath: '/uploads/audio/default/mum.mp3', 
    category: 'default',
    isActive: true
  },
  { 
    id: 'grandpa', 
    name: 'Grandpa', 
    imagePath: '/uploads/images/default/grandpa.jpeg', 
    audioPath: '/uploads/audio/default/grandpa.mp3', 
    category: 'default',
    isActive: true
  },
  { 
    id: 'cupcake', 
    name: 'Cupcake', 
    imagePath: '/uploads/images/default/cupcake.jpg', 
    audioPath: '/uploads/audio/default/cupcake.mp3', 
    category: 'default',
    isActive: true
  },
  { 
    id: 'grandma', 
    name: 'Grandma', 
    imagePath: '/uploads/images/default/grandma.jpg', 
    audioPath: '/uploads/audio/default/grandma.mp3', 
    category: 'default',
    isActive: true
  },
  { 
    id: 'green', 
    name: 'Green', 
    imagePath: '/uploads/images/default/green.jpg', 
    audioPath: '/uploads/audio/default/green.mp3', 
    category: 'default',
    isActive: true
  },
  { 
    id: 'yellow', 
    name: 'Yellow', 
    imagePath: '/uploads/images/default/yellow.jpg', 
    audioPath: '/uploads/audio/default/yellow.mp3', 
    category: 'default',
    isActive: true
  },

  // === ISTNIEJĄCE KARTY ZWIERZĄT ===
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
  },

  // === NOWE KARTY UBRAŃ! ===
  { 
    id: 'autumn', 
    name: 'Autumn', 
    imagePath: '/uploads/images/clothes/autumn.jpg', 
    audioPath: '/uploads/audio/clothes/autumn.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'boots', 
    name: 'Boots', 
    imagePath: '/uploads/images/clothes/boots.jpg', 
    audioPath: '/uploads/audio/clothes/boots.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'cap', 
    name: 'Cap', 
    imagePath: '/uploads/images/clothes/cap.jpg', 
    audioPath: '/uploads/audio/clothes/cap.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'coat', 
    name: 'Coat', 
    imagePath: '/uploads/images/clothes/coat.jpg', 
    audioPath: '/uploads/audio/clothes/coat.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'fleece', 
    name: 'Fleece', 
    imagePath: '/uploads/images/clothes/fleece.jpg', 
    audioPath: '/uploads/audio/clothes/fleece.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'gloves', 
    name: 'Gloves', 
    imagePath: '/uploads/images/clothes/gloves.jpg', 
    audioPath: '/uploads/audio/clothes/gloves.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'hat', 
    name: 'Hat', 
    imagePath: '/uploads/images/clothes/hat.jpg', 
    audioPath: '/uploads/audio/clothes/hat.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'jumper', 
    name: 'Jumper', 
    imagePath: '/uploads/images/clothes/jumper.jpg', 
    audioPath: '/uploads/audio/clothes/jumper.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'scarf', 
    name: 'Scarf', 
    imagePath: '/uploads/images/clothes/scarf.jpg', 
    audioPath: '/uploads/audio/clothes/scarf.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'shoes', 
    name: 'Shoes', 
    imagePath: '/uploads/images/clothes/shoes.jpg', 
    audioPath: '/uploads/audio/clothes/shoes.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'shorts', 
    name: 'Shorts', 
    imagePath: '/uploads/images/clothes/shorts.jpg', 
    audioPath: '/uploads/audio/clothes/shorts.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'skirt', 
    name: 'Skirt', 
    imagePath: '/uploads/images/clothes/skirt.jpg', 
    audioPath: '/uploads/audio/clothes/skirt.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'spring', 
    name: 'Spring', 
    imagePath: '/uploads/images/clothes/spring.jpg', 
    audioPath: '/uploads/audio/clothes/spring.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'summer', 
    name: 'Summer', 
    imagePath: '/uploads/images/clothes/summer.jpg', 
    audioPath: '/uploads/audio/clothes/summer.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 't-shirt', 
    name: 'T-shirt', 
    imagePath: '/uploads/images/clothes/t-shirt.jpg', 
    audioPath: '/uploads/audio/clothes/t-shirt.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'trousers', 
    name: 'Trousers', 
    imagePath: '/uploads/images/clothes/trousers.jpg', 
    audioPath: '/uploads/audio/clothes/trousers.mp3', 
    category: 'clothes',
    isActive: true
  },
  { 
    id: 'winter', 
    name: 'Winter', 
    imagePath: '/uploads/images/clothes/winter.jpg', 
    audioPath: '/uploads/audio/clothes/winter.mp3', 
    category: 'clothes',
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