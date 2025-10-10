#!/usr/bin/env node

/**
 * Complete Database Seeding Script
 * This script clears the database and seeds it with all test data
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/avs-family-tree';

console.log('🌱 AVS Family Tree - Complete Database Seeding');
console.log('=' .repeat(60));

async function clearDatabase() {
  console.log('\n🗑️  Clearing existing data...');
  
  try {
    const collections = await mongoose.connection.db.collections();
    
    for (let collection of collections) {
      await collection.deleteMany({});
      console.log(`   ✅ Cleared: ${collection.collectionName}`);
    }
    
    console.log('✅ Database cleared successfully!\n');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

async function seedBasicUsers() {
  console.log('👤 Creating basic users...\n');
  
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  
  const users = [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@avs.com',
      mobile: '9999999999',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true,
      isMobileVerified: true,
      isApprovedByAdmin: true,
      enableMarriageFlag: false,
    },
    {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@avs.com',
      mobile: '8888888888',
      password: 'test1234',
      role: 'user',
      isEmailVerified: true,
      isMobileVerified: true,
      isApprovedByAdmin: true,
      enableMarriageFlag: false,
    },
    {
      firstName: 'Venkataraman',
      lastName: 'Iyer',
      email: 'venkat.iyer@avs.com',
      mobile: '9876500001',
      password: 'password123',
      role: 'user',
      isEmailVerified: true,
      isMobileVerified: true,
      isApprovedByAdmin: true,
      gothiram: 'Bharadwaja',
      nativePlace: 'Thanjavur',
      city: 'Chennai',
      enableMarriageFlag: false,
    },
    {
      firstName: 'Ramesh',
      lastName: 'Venkataraman',
      email: 'ramesh.venkat@avs.com',
      mobile: '9876500003',
      password: 'password123',
      role: 'user',
      isEmailVerified: true,
      isMobileVerified: true,
      isApprovedByAdmin: true,
      gothiram: 'Bharadwaja',
      nativePlace: 'Thanjavur',
      city: 'Bangalore',
      enableMarriageFlag: false,
    },
    {
      firstName: 'Arun',
      lastName: 'Ramesh',
      email: 'arun.ramesh@avs.com',
      mobile: '9876500006',
      password: 'password123',
      role: 'user',
      isEmailVerified: true,
      isMobileVerified: true,
      isApprovedByAdmin: true,
      gothiram: 'Bharadwaja',
      nativePlace: 'Thanjavur',
      city: 'Mumbai',
      enableMarriageFlag: true,
    }
  ];
  
  const createdUsers = [];
  
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedUser = await user.save();
    createdUsers.push(savedUser);
    
    console.log(`   ✅ Created: ${savedUser.firstName} ${savedUser.lastName} (${savedUser.email})`);
  }
  
  return createdUsers;
}

async function seedRelationships(users) {
  console.log('\n👨‍👩‍👦 Creating relationships...\n');
  
  const Relationship = mongoose.model('Relationship', new mongoose.Schema({}, { strict: false }));
  
  // Find users by name for relationships
  const findUser = (firstName) => users.find(u => u.firstName === firstName);
  
  const venkat = findUser('Venkataraman');
  const ramesh = findUser('Ramesh');
  const arun = findUser('Arun');
  
  if (venkat && ramesh) {
    const rel1 = new Relationship({
      person1: venkat._id,
      person2: ramesh._id,
      relationType: 'Parent-Child',
      description: 'Father-Son relationship',
      isApproved: true,
      createdBy: venkat._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await rel1.save();
    console.log(`   ✅ Relationship: ${venkat.firstName} → ${ramesh.firstName} (Parent-Child)`);
  }
  
  if (ramesh && arun) {
    const rel2 = new Relationship({
      person1: ramesh._id,
      person2: arun._id,
      relationType: 'Parent-Child',
      description: 'Father-Son relationship',
      isApproved: true,
      createdBy: ramesh._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await rel2.save();
    console.log(`   ✅ Relationship: ${ramesh.firstName} → ${arun.firstName} (Parent-Child)`);
  }
}

async function seedGothirams() {
  console.log('\n🏛️  Creating Gothirams...\n');
  
  const Gothiram = mongoose.model('Gothiram', new mongoose.Schema({}, { strict: false }));
  
  const gothirams = [
    { name: 'Bharadwaja', isActive: true },
    { name: 'Kasyapa', isActive: true },
    { name: 'Vashishta', isActive: true },
    { name: 'Gautama', isActive: true },
    { name: 'Atri', isActive: true },
  ];
  
  for (const g of gothirams) {
    const gothiram = new Gothiram({
      ...g,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await gothiram.save();
    console.log(`   ✅ Created Gothiram: ${gothiram.name}`);
  }
}

async function main() {
  try {
    // Connect to MongoDB
    console.log(`\n📡 Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Clear database
    await clearDatabase();
    
    // Seed data
    const users = await seedBasicUsers();
    await seedRelationships(users);
    await seedGothirams();
    
    // Print summary
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 Database seeding completed successfully!');
    console.log('=' .repeat(60));
    console.log('\n📝 Login Credentials:\n');
    console.log('👑 Admin Account:');
    console.log('   Email: admin@avs.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('👤 Test User Accounts (all password: password123):');
    console.log('   • test@avs.com');
    console.log('   • venkat.iyer@avs.com');
    console.log('   • ramesh.venkat@avs.com');
    console.log('   • arun.ramesh@avs.com');
    console.log('');
    console.log('📊 Statistics:');
    console.log(`   • Users created: ${users.length}`);
    console.log('   • Relationships: 2');
    console.log('   • Gothirams: 5');
    console.log('');
    console.log('🚀 Start the app: npm run dev');
    console.log('🌐 Login at: http://localhost:3000/auth/login');
    console.log('=' .repeat(60) + '\n');
    
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB\n');
    process.exit(0);
  }
}

// Run the seeding
main();

