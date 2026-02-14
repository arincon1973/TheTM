/**
 * Simple MongoDB Connection Test
 * Run this to verify your MongoDB Atlas connection works
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://arincon73_db_user:GB43QqD9jeJsTMsy@thinkmate.y5tlj6d.mongodb.net/Thinkmate?appName=ThinkMate';

async function testConnection() {
  try {
    console.log('🔵 Attempting to connect to MongoDB Atlas...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      tls: true,
      tlsAllowInvalidCertificates: false,
      retryWrites: true,
      w: 'majority',
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log('✅ Database:', mongoose.connection.db.databaseName);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('✅ Collections found:', collections.map(c => c.name).join(', '));
    
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    console.error('\nPossible causes:');
    console.error('1. IP address not whitelisted in MongoDB Atlas Network Access');
    console.error('2. Cluster is paused');
    console.error('3. Invalid credentials');
    console.error('4. Network connectivity issue');
    process.exit(1);
  }
}

testConnection();
