const http = require('http');

// Simple HTTP request function
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAPI() {
  const baseURL = 'localhost';
  const port = 3000;
  
  console.log('🧪 Testing Memory Game API...\n');
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const health = await makeRequest({
      hostname: baseURL,
      port: port,
      path: '/api/health',
      method: 'GET'
    });
    console.log(`   ✅ Status: ${health.status}`);
    console.log(`   📊 Response: ${health.data.message}\n`);
    
    // Test 2: Get all cards
    console.log('2️⃣ Testing cards endpoint...');
    const cards = await makeRequest({
      hostname: baseURL,
      port: port,
      path: '/api/cards',
      method: 'GET'
    });
    console.log(`   ✅ Status: ${cards.status}`);
    console.log(`   📊 Cards found: ${cards.data.length}\n`);
    
    // Test 3: Get random cards
    console.log('3️⃣ Testing random cards endpoint...');
    const randomCards = await makeRequest({
      hostname: baseURL,
      port: port,
      path: '/api/cards/random/8',
      method: 'GET'
    });
    console.log(`   ✅ Status: ${randomCards.status}`);
    console.log(`   📊 Random cards: ${randomCards.data.length}\n`);
    
    // Test 4: Create new game
    console.log('4️⃣ Testing new game creation...');
    const newGame = await makeRequest({
      hostname: baseURL,
      port: port,
      path: '/api/game/new',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      player1Name: 'Inka',
      player2Name: 'Gabriel'
    });
    console.log(`   ✅ Status: ${newGame.status}`);
    if (newGame.data.gameId) {
      console.log(`   🎮 Game ID: ${newGame.data.gameId}`);
      console.log(`   👥 Players: ${newGame.data.players.map(p => p.name).join(' vs ')}`);
    }
    
    console.log('\n🎉 API tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running on port 3000');
  }
}

testAPI();
