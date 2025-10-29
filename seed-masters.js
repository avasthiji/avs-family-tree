// Seed script for Rasi, Nakshatram, and Gothiram master data
require("dotenv").config();
const mongoose = require("mongoose");

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/avs";

// Define schemas
const RasiSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    tamilName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const NakshatramSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    tamilName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const GothiramSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    tamilName: { type: String, required: true },
    godOfWorship: String,
    templeLocation: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Models
const Rasi = mongoose.models.Rasi || mongoose.model("Rasi", RasiSchema);
const Nakshatram =
  mongoose.models.Nakshatram || mongoose.model("Nakshatram", NakshatramSchema);
const Gothiram =
  mongoose.models.Gothiram || mongoose.model("Gothiram", GothiramSchema);

// Rasi Data (12 Zodiac Signs)
const rasiData = [
  { name: "Mesham", tamilName: "மேஷம்" },
  { name: "Rishabam", tamilName: "ரிஷபம்" },
  { name: "Mithunam", tamilName: "மிதுனம்" },
  { name: "Kadagam", tamilName: "கடகம்" },
  { name: "Simmam", tamilName: "சிம்மம்" },
  { name: "Kanni", tamilName: "கன்னி" },
  { name: "Thulaam", tamilName: "துலாம்" },
  { name: "Vrischigam", tamilName: "விருச்சிகம்" },
  { name: "Dhanusu", tamilName: "தனுசு" },
  { name: "Makaram", tamilName: "மகரம்" },
  { name: "Kumbam", tamilName: "கும்பம்" },
  { name: "Meenam", tamilName: "மீனம்" },
];

// Nakshatram Data (27 Birth Stars)
const nakshatramData = [
  { name: "Ashwini", tamilName: "அஸ்வினி" },
  { name: "Bharani", tamilName: "பரணி" },
  { name: "Krittika", tamilName: "கார்த்திகை" },
  { name: "Rohini", tamilName: "ரோஹிணி" },
  { name: "Mrigashirsha", tamilName: "மிருகசீரிஷம்" },
  {
    name: "Thiruvaathirai",
    tamilName: "திருவாதிரை",
  },
  {
    name: "Punarpoosam",
    tamilName: "புனர்பூசம்",
  },
  { name: "Poosam", tamilName: "பூசம்" },
  { name: "Ayilyam", tamilName: "ஆயில்யம்" },
  { name: "Magam", tamilName: "மகம்" },
  { name: "Pooram", tamilName: "பூரம்" },
  {
    name: "Uthiram",
    tamilName: "உத்திரம்",
    alternateNames: ["Uttara Phalguni"],
  },
  { name: "Hastham", tamilName: "ஹஸ்தம்" },
  { name: "Chithirai", tamilName: "சித்திரை" },
  { name: "Swathi", tamilName: "சுவாதி" },
  { name: "Visakam", tamilName: "விசாகம்" },
  { name: "Anusham", tamilName: "அனுஷம்" },
  { name: "Kettai", tamilName: "கேட்டை" },
  { name: "Moolam", tamilName: "மூலம்" },
  { name: "Pooradam", tamilName: "பூராடம்" },
  {
    name: "Uthiradam",
    tamilName: "உத்திராடம்",
  },
  { name: "Thiruvonam", tamilName: "திருவோணம்" },
  { name: "Avittam", tamilName: "அவிட்டம்" },
  { name: "Sadayam", tamilName: "சதயம்" },
  {
    name: "Poorattadhi",
    tamilName: "பூரட்டாதி",
  },
  {
    name: "Uthirattadhi",
    tamilName: "உத்திரட்டாதி",
  },
  { name: "Revathi", tamilName: "ரேவதி" },
];

// Gothiram Data (33 Gotras)
const gothiramData = [
  {
    name: "Alatudaiyan",
    tamilName: "ஆலத்துடையான்",
    godOfWorship: "Arulmigu Mangayee Amman",
    templeLocation: "Alattulaianpatti",
  },
  {
    name: "Ethumaludaiyan",
    tamilName: "எதுமலுடையான்",
    godOfWorship: "Arulmigu Neelavanathi Amman",
    templeLocation: "Edhumalai",
  },
  {
    name: "Gunakathudaiyan",
    tamilName: "குணகேள்காத்துடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Kalappalan (Valamudaiyan)",
    tamilName: "களப்பாளர் (வளமுடையான்)",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Kalathudaiyan",
    tamilName: "காளத்துடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Kaarudaiyan",
    tamilName: "காருடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Koondudaiyan",
    tamilName: "கோனுடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Konnakudaiyan",
    tamilName: "கொன்னக்குடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Koothudaiyan",
    tamilName: "கூத்துடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Koottudaiyan",
    tamilName: "கோட்டுடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Kuruvaludaiyan (Kuruvarludaiyan)",
    tamilName: "குருவருளுடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Marudhudaiyan",
    tamilName: "மருதுடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Mathudaiyan",
    tamilName: "மாத்துடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Mirathudaiyan (Kuruvaludaiyan)",
    tamilName: "மிரட்டுடையான் (குருவலுடையான்)",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Murugathudaiyan",
    tamilName: "முருகத்துடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Nalludaiyan",
    tamilName: "நல்லுடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Nathamudaiyan",
    tamilName: "நத்தமுடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Nimaludaiyan",
    tamilName: "நிம்மலுடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Panaiyadaiyan",
    tamilName: "பனையடியான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Pavaludaiyan",
    tamilName: "பாவலுடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Pundiludaiyan",
    tamilName: "பூண்டிலுடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Samayamanthiri",
    tamilName: "சமயமந்திரி",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Sannamangalathudaiyan (Pethaan)",
    tamilName: "சன்னமங்கலத்துடையான் (பேதான்)",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Sathudaiyan",
    tamilName: "சாத்துடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Siruthalanudaiyan",
    tamilName: "சிறுதலனுடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Thettumangalathudaiyan",
    tamilName: "தெத்தமங்கலத்துடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Thevangudaiyan",
    tamilName: "தேவங்குடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Thirusangudaiyan",
    tamilName: "திருச்சங்குடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Valavuthiranailathambe (Valavudaiyan)",
    tamilName: "வளவுதிரனைலத்தம்பே",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Velanchakravarthi",
    tamilName: "சக்கரவர்த்தி",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Vennavaludaiyan",
    tamilName: "வெண்ணாவலுடையான்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Vilvarayan",
    tamilName: "வில்வராயன்",
    godOfWorship: "",
    templeLocation: "",
  },
  {
    name: "Vivarayan",
    tamilName: "விவராயன்",
    godOfWorship: "",
    templeLocation: "",
  },
];

// Seed function
async function seedMasterData() {
  try {
    console.log("🌱 Starting seed process...\n");

    // Connect to MongoDB
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Seed Rasi
    console.log("📊 Seeding Rasi (Zodiac Signs)...");
    const rasiResult = await Rasi.insertMany(rasiData, {
      ordered: false,
    }).catch((err) => {
      if (err.code === 11000) {
        console.log(
          "⚠️  Some Rasi entries already exist, skipping duplicates..."
        );
      }
    });
    console.log(`✅ Rasi seeding completed: ${rasiData.length} entries\n`);

    // Seed Nakshatram
    console.log("⭐ Seeding Nakshatram (Birth Stars)...");
    const nakshatramResult = await Nakshatram.insertMany(nakshatramData, {
      ordered: false,
    }).catch((err) => {
      if (err.code === 11000) {
        console.log(
          "⚠️  Some Nakshatram entries already exist, skipping duplicates..."
        );
      }
    });
    console.log(
      `✅ Nakshatram seeding completed: ${nakshatramData.length} entries\n`
    );

    // Seed Gothiram
    console.log("🏛️  Seeding Gothiram (Gotras)...");
    const gothiramResult = await Gothiram.insertMany(gothiramData, {
      ordered: false,
    }).catch((err) => {
      if (err.code === 11000) {
        console.log(
          "⚠️  Some Gothiram entries already exist, skipping duplicates..."
        );
      }
    });
    console.log(
      `✅ Gothiram seeding completed: ${gothiramData.length} entries\n`
    );

    // Summary
    console.log("═══════════════════════════════════════");
    console.log("✨ Master Data Seeding Summary");
    console.log("═══════════════════════════════════════");
    console.log(`📊 Rasi: ${rasiData.length} entries`);
    console.log(`⭐ Nakshatram: ${nakshatramData.length} entries`);
    console.log(`🏛️  Gothiram: ${gothiramData.length} entries`);
    console.log("═══════════════════════════════════════");
    console.log("🎉 All master data seeded successfully!\n");

    // Display counts from database
    const rasiCount = await Rasi.countDocuments();
    const nakshatramCount = await Nakshatram.countDocuments();
    const gothiramCount = await Gothiram.countDocuments();

    console.log("📈 Current Database Counts:");
    console.log(`   Rasi: ${rasiCount}`);
    console.log(`   Nakshatram: ${nakshatramCount}`);
    console.log(`   Gothiram: ${gothiramCount}\n`);
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
}

// Run seeder
seedMasterData();
