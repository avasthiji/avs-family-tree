// Seed script for Rasi, Nakshatram, Gothiram, and Kuladeivam master data
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
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const KuladeivamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    tamilName: { type: String, required: false, default: "" },
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
const Kuladeivam =
  mongoose.models.Kuladeivam || mongoose.model("Kuladeivam", KuladeivamSchema);

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

// Gothiram Data (33 Gotras) - Without God of Worship
const gothiramData = [
  { name: "Alatudaiyan", tamilName: "ஆலத்துடையான்" },
  { name: "Ethumaludaiyan", tamilName: "எதுமலுடையான்" },
  { name: "Gunakathudaiyan", tamilName: "குணகேள்காத்துடையான்" },
  { name: "Kalappalan (Valamudaiyan)", tamilName: "களப்பாளர் (வளமுடையான்)" },
  { name: "Kalathudaiyan", tamilName: "காளத்துடையான்" },
  { name: "Kaarudaiyan", tamilName: "காருடையான்" },
  { name: "Koondudaiyan", tamilName: "கோனுடையான்" },
  { name: "Konnakudaiyan", tamilName: "கொன்னக்குடையான்" },
  { name: "Koothudaiyan", tamilName: "கூத்துடையான்" },
  { name: "Koottudaiyan", tamilName: "கோட்டுடையான்" },
  { name: "Kuruvaludaiyan (Kuruvarludaiyan)", tamilName: "குருவருளுடையான்" },
  { name: "Marudhudaiyan", tamilName: "மருதுடையான்" },
  { name: "Mathudaiyan", tamilName: "மாத்துடையான்" },
  {
    name: "Mirathudaiyan (Kuruvaludaiyan)",
    tamilName: "மிரட்டுடையான் (குருவலுடையான்)",
  },
  { name: "Murugathudaiyan", tamilName: "முருகத்துடையான்" },
  { name: "Nalludaiyan", tamilName: "நல்லுடையான்" },
  { name: "Nathamudaiyan", tamilName: "நத்தமுடையான்" },
  { name: "Nimaludaiyan", tamilName: "நிம்மலுடையான்" },
  { name: "Panaiyadaiyan", tamilName: "பனையடியான்" },
  { name: "Pavaludaiyan", tamilName: "பாவலுடையான்" },
  { name: "Pundiludaiyan", tamilName: "பூண்டிலுடையான்" },
  { name: "Samayamanthiri", tamilName: "சமயமந்திரி" },
  {
    name: "Sannamangalathudaiyan (Pethaan)",
    tamilName: "சன்னமங்கலத்துடையான் (பேதான்)",
  },
  { name: "Sathudaiyan", tamilName: "சாத்துடையான்" },
  { name: "Siruthalanudaiyan", tamilName: "சிறுதலனுடையான்" },
  { name: "Thettumangalathudaiyan", tamilName: "தெத்தமங்கலத்துடையான்" },
  { name: "Thevangudaiyan", tamilName: "தேவங்குடையான்" },
  { name: "Thirusangudaiyan", tamilName: "திருச்சங்குடையான்" },
  {
    name: "Valavuthiranailathambe (Valavudaiyan)",
    tamilName: "வளவுதிரனைலத்தம்பே",
  },
  { name: "Velanchakravarthi", tamilName: "சக்கரவர்த்தி" },
  { name: "Vennavaludaiyan", tamilName: "வெண்ணாவலுடையான்" },
  { name: "Vilvarayan", tamilName: "வில்வராயன்" },
  { name: "Vivarayan", tamilName: "விவராயன்" },
];

// Kuladeivam Data (Gods of Worship) - Separate from Gothiram
const kuladeivamData = [
  { name: "Arulmigu Mangayee Amman", tamilName: "" },
  { name: "Arulmigu Neelavanathi Amman", tamilName: "" },
  { name: "Arulmigu Sellaye Amman", tamilName: "" },
  { name: "Arulmigu Aadyakalam Katha Amman", tamilName: "" },
  { name: "Arulmigu Ellai Amman", tamilName: "" },
  { name: "Arulmigu Anagalaparameswari", tamilName: "" },
  { name: "Arulmigu Periyandasamy Kovil Muthaiyan", tamilName: "" },
  { name: "Arulmigu Sellaye Amman", tamilName: "" },
  { name: "Arulmigu Papathi Amman", tamilName: "" },
  { name: "Arulmigu Karrupu", tamilName: "" },
  { name: "Arulmigu Sellandi Amman", tamilName: "" },
  { name: "Arulmigu Thaichi Amman", tamilName: "" },
  { name: "Arulmigu Venkatachalapathy", tamilName: "" },
  { name: "Arulmigu Periyakovil Deivangal", tamilName: "" },
  { name: "Arulmigu Sellayee Amman", tamilName: "" },
  { name: "Arulmigu Thayumanavar Samy", tamilName: "" },
  { name: "Arulmigu Papathi Amman", tamilName: "" },
  { name: "Arulmigu Meenakshi Amman", tamilName: "" },
  { name: "Arulmigu Aalai Muthaiyan", tamilName: "" },
  { name: "Arulmigu Ayyanar", tamilName: "" },
  { name: "Arulmigu Ayyanar", tamilName: "" },
  { name: "Arulmigu Elayee Amman", tamilName: "" },
  { name: "Arulmigu Aravayi Amman", tamilName: "" },
  { name: "Arulmigu Puthu Karruppannaswamy", tamilName: "" },
  { name: "Arulmigu Srirangam Aranganathar", tamilName: "" },
  { name: "Arulmigu Aeramveeli Amman", tamilName: "" },
  { name: "Arulmigu Vellankarruppu", tamilName: "" },
  { name: "Arulmigu Pachai Amman", tamilName: "" },
  { name: "Arulmigu Venkatachalapathi", tamilName: "" },
  { name: "Arulmigu Karruppanaswamy", tamilName: "" },
  { name: "Arulmigu Arapalisvara", tamilName: "" },
  { name: "Arulmigu Irrani Amman", tamilName: "" },
  { name: "Arulmigu Venkatachalapathy", tamilName: "" },
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

    // Seed Kuladeivam
    console.log("🕉️  Seeding Kuladeivam (Gods of Worship)...");
    const kuladeivamResult = await Kuladeivam.insertMany(kuladeivamData, {
      ordered: false,
    }).catch((err) => {
      if (err.code === 11000) {
        console.log(
          "⚠️  Some Kuladeivam entries already exist, skipping duplicates..."
        );
      }
    });
    console.log(
      `✅ Kuladeivam seeding completed: ${kuladeivamData.length} entries\n`
    );

    // Summary
    console.log("═══════════════════════════════════════");
    console.log("✨ Master Data Seeding Summary");
    console.log("═══════════════════════════════════════");
    console.log(`📊 Rasi: ${rasiData.length} entries`);
    console.log(`⭐ Nakshatram: ${nakshatramData.length} entries`);
    console.log(`🏛️  Gothiram: ${gothiramData.length} entries`);
    console.log(`🕉️  Kuladeivam: ${kuladeivamData.length} entries`);
    console.log("═══════════════════════════════════════");
    console.log("🎉 All master data seeded successfully!\n");

    // Display counts from database
    const rasiCount = await Rasi.countDocuments();
    const nakshatramCount = await Nakshatram.countDocuments();
    const gothiramCount = await Gothiram.countDocuments();
    const kuladeivamCount = await Kuladeivam.countDocuments();

    console.log("📈 Current Database Counts:");
    console.log(`   Rasi: ${rasiCount}`);
    console.log(`   Nakshatram: ${nakshatramCount}`);
    console.log(`   Gothiram: ${gothiramCount}`);
    console.log(`   Kuladeivam: ${kuladeivamCount}\n`);
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
