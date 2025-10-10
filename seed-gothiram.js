const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

// Define schema inline to avoid import issues
const GothiramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Gothiram = mongoose.models.Gothiram || mongoose.model('Gothiram', GothiramSchema);

// Common AVS Gothirams
const defaultGothirams = [
  'Kashyapa',
  'Bharadwaja',
  'Kaushika',
  'Atri',
  'Gautama',
  'Jamadagni',
  'Vasishta',
  'Agastya',
  'Kaundinya',
  'Viswamitra',
  'Angirasa',
  'Bhrigu',
  'Harita',
  'Mudgala',
  'Sandilya',
  'Vatsya',
  'Parasara',
  'Garga',
  'Katyayana',
  'Srivatsa'
];

async function seedGothirams() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/avs-family-tree';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing gothirams (optional - comment out if you want to keep existing)
    // await Gothiram.deleteMany({});
    // console.log('🗑️  Cleared existing gothirams');

    // Get admin user for createdBy
    const User = mongoose.model('User');
    const admin = await User.findOne({ role: 'admin' });
    const createdById = admin ? admin._id : null;

    // Insert gothirams
    let addedCount = 0;
    let skippedCount = 0;

    for (const name of defaultGothirams) {
      try {
        const existing = await Gothiram.findOne({ name });
        if (existing) {
          console.log(`⏭️  Skipped (already exists): ${name}`);
          skippedCount++;
        } else {
          await Gothiram.create({
            name,
            isActive: true,
            createdBy: createdById
          });
          console.log(`✅ Added: ${name}`);
          addedCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to add ${name}:`, error.message);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Added: ${addedCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   📝 Total: ${defaultGothirams.length}`);
    
    // List all gothirams
    const all = await Gothiram.find().sort({ name: 1 });
    console.log(`\n📋 All Gothirams in Database (${all.length}):`);
    all.forEach((g, i) => {
      console.log(`   ${i + 1}. ${g.name} ${g.isActive ? '✅' : '⚪'}`);
    });

    console.log('\n🎉 Gothiram seeding complete!');
    
  } catch (error) {
    console.error('❌ Error seeding gothirams:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seed function
seedGothirams();

