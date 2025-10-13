import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import bcrypt from "bcryptjs";
import connectDB from "./db";
import User from "@/models/User";
import Relationship from "@/models/Relationship";

/**
 * Complete 3-Generation Family Tree Structure:
 * 
 * Generation 1 (Grandparents):
 * - Venkataraman Iyer (Grandfather)
 * - Lakshmi Venkataraman (Grandmother)
 * 
 * Generation 2 (Parents & Uncle):
 * - Ramesh Venkataraman (Father)
 * - Saroja Ramesh (Mother)
 * - Murali Venkataraman (Uncle - Father's brother)
 * 
 * Generation 3 (Current User, Spouse, Siblings):
 * - Arun Ramesh (Main User - YOU)
 * - Priya Arun (Arun's Wife/Spouse)
 * - Divya Ramesh (Arun's Sister)
 * - Kumar Ramesh (Arun's Brother)
 * 
 * Generation 4 (Children):
 * - Rohan Arun (Arun's Son)
 */

const completeFamily = [
  // === GENERATION 1: GRANDPARENTS ===
  {
    firstName: "Venkataraman",
    lastName: "Iyer",
    email: "venkat.iyer@avs.com",
    mobile: "9876500001",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Male" as const,
    dob: new Date("1950-03-10"),
    placeOfBirth: "Kumbakonam",
    timeOfBirth: "05:30",
    height: 168,
    rasi: "Simha",
    natchathiram: "Magha",
    gothiram: "Bharadvaja",
    primaryPhone: "9876500001",
    qualification: "BA",
    jobDesc: "Retired Government Officer",
    salary: "Retired",
    bioDesc: "Patriarch of the Venkataraman family. Former government officer with deep roots in Thanjavur district.",
    workPlace: "Retired",
    nativePlace: "Kumbakonam",
    address1: "Old AVS Colony",
    city: "Kumbakonam",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "612001",
    citizenship: "Indian",
    kuladeivam: "Sarangapani Temple",
    enableMarriageFlag: false,
    profilePicture: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
  },
  
  {
    firstName: "Lakshmi",
    lastName: "Venkataraman",
    email: "lakshmi.venkat@avs.com",
    mobile: "9876500002",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Female" as const,
    dob: new Date("1952-07-15"),
    placeOfBirth: "Thanjavur",
    timeOfBirth: "08:45",
    height: 158,
    rasi: "Kanya",
    natchathiram: "Hasta",
    gothiram: "Bharadvaja",
    primaryPhone: "9876500002",
    qualification: "BA",
    jobDesc: "Homemaker",
    salary: "N/A",
    bioDesc: "Matriarch of the family. Known for her traditional cooking and cultural knowledge.",
    workPlace: "Home",
    nativePlace: "Thanjavur",
    address1: "Old AVS Colony",
    city: "Kumbakonam",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "612001",
    citizenship: "Indian",
    kuladeivam: "Brihadeeswarar Temple",
    enableMarriageFlag: false,
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  },

  // === GENERATION 2: PARENTS & UNCLE ===
  {
    firstName: "Ramesh",
    lastName: "Venkataraman",
    email: "ramesh.venkat@avs.com",
    mobile: "9876500003",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Male" as const,
    dob: new Date("1975-11-20"),
    placeOfBirth: "Chennai",
    timeOfBirth: "10:15",
    height: 172,
    rasi: "Dhanu",
    natchathiram: "Poorvashada",
    gothiram: "Bharadvaja",
    primaryPhone: "9876500003",
    qualification: "B.Tech",
    jobDesc: "Senior Engineer",
    salary: "1500000+",
    bioDesc: "Senior software engineer with 25 years of experience. Proud father and dedicated family man.",
    workPlace: "Chennai",
    nativePlace: "Kumbakonam",
    address1: "AVS Avenue, Adyar",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600020",
    citizenship: "Indian",
    kuladeivam: "Sarangapani Temple",
    enableMarriageFlag: false,
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },

  {
    firstName: "Saroja",
    lastName: "Ramesh",
    email: "saroja.ramesh@avs.com",
    mobile: "9876500004",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Female" as const,
    dob: new Date("1978-04-08"),
    placeOfBirth: "Madurai",
    timeOfBirth: "14:30",
    height: 162,
    rasi: "Meena",
    natchathiram: "Revati",
    gothiram: "Kashyapa",
    primaryPhone: "9876500004",
    qualification: "M.Sc",
    jobDesc: "School Principal",
    salary: "800000+",
    bioDesc: "Dedicated educator and loving mother. Passionate about preserving Tamil culture.",
    workPlace: "Chennai",
    nativePlace: "Madurai",
    address1: "AVS Avenue, Adyar",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600020",
    citizenship: "Indian",
    kuladeivam: "Meenakshi Temple",
    enableMarriageFlag: false,
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },

  {
    firstName: "Murali",
    lastName: "Venkataraman",
    email: "murali.venkat@avs.com",
    mobile: "9876500005",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Male" as const,
    dob: new Date("1978-09-05"),
    placeOfBirth: "Chennai",
    timeOfBirth: "07:20",
    height: 170,
    rasi: "Makara",
    natchathiram: "Shravana",
    gothiram: "Bharadvaja",
    primaryPhone: "9876500005",
    qualification: "MBA",
    jobDesc: "Business Owner",
    salary: "2000000+",
    bioDesc: "Successful entrepreneur and Ramesh's younger brother. Active in AVS community events.",
    workPlace: "Bangalore",
    nativePlace: "Kumbakonam",
    address1: "Business District",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    postalCode: "560001",
    citizenship: "Indian",
    kuladeivam: "Sarangapani Temple",
    enableMarriageFlag: false,
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },

  // === GENERATION 3: CURRENT USER (YOU), SPOUSE & SIBLINGS ===
  {
    firstName: "Arun",
    lastName: "Ramesh",
    email: "arun.ramesh@avs.com",
    mobile: "9876500006",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Male" as const,
    dob: new Date("2000-06-15"),
    placeOfBirth: "Chennai",
    timeOfBirth: "09:30",
    height: 175,
    rasi: "Mithuna",
    natchathiram: "Punarvasu",
    gothiram: "Bharadvaja",
    primaryPhone: "9876500006",
    qualification: "B.E Computer Science",
    jobDesc: "Software Engineer",
    salary: "1200000+",
    bioDesc: "Young software engineer passionate about technology and family heritage. Building the AVS Family Tree application.",
    workPlace: "Chennai",
    nativePlace: "Kumbakonam",
    address1: "Tech Park Road, OMR",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600096",
    citizenship: "Indian",
    kuladeivam: "Sarangapani Temple",
    enableMarriageFlag: true,
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  },

  {
    firstName: "Priya",
    lastName: "Arun",
    email: "priya.arun@avs.com",
    mobile: "9876500007",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Female" as const,
    dob: new Date("2001-12-22"),
    placeOfBirth: "Trichy",
    timeOfBirth: "16:45",
    height: 165,
    rasi: "Tula",
    natchathiram: "Chitra",
    gothiram: "Vishwamitra",
    primaryPhone: "9876500007",
    qualification: "B.Tech IT",
    jobDesc: "UI/UX Designer",
    salary: "900000+",
    bioDesc: "Creative designer and Arun's wife. Loves traditional art and modern design.",
    partnerDesc: "Looking for a partner who values family traditions and modern thinking.",
    workPlace: "Chennai",
    nativePlace: "Trichy",
    address1: "Tech Park Road, OMR",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600096",
    citizenship: "Indian",
    kuladeivam: "Ranganathar Temple",
    enableMarriageFlag: false,
    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },

  {
    firstName: "Divya",
    lastName: "Ramesh",
    email: "divya.ramesh@avs.com",
    mobile: "9876500008",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Female" as const,
    dob: new Date("2002-03-18"),
    placeOfBirth: "Chennai",
    timeOfBirth: "11:20",
    height: 163,
    rasi: "Karka",
    natchathiram: "Pushya",
    gothiram: "Bharadvaja",
    primaryPhone: "9876500008",
    qualification: "B.Sc Psychology",
    jobDesc: "HR Professional",
    salary: "700000+",
    bioDesc: "HR professional and Arun's younger sister. Passionate about people and community service.",
    partnerDesc: "Seeking a caring and family-oriented partner with good values.",
    workPlace: "Chennai",
    nativePlace: "Kumbakonam",
    address1: "Anna Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600040",
    citizenship: "Indian",
    kuladeivam: "Sarangapani Temple",
    enableMarriageFlag: true,
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
  },

  {
    firstName: "Kumar",
    lastName: "Ramesh",
    email: "kumar.ramesh@avs.com",
    mobile: "9876500009",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Male" as const,
    dob: new Date("2004-08-25"),
    placeOfBirth: "Chennai",
    timeOfBirth: "18:10",
    height: 178,
    rasi: "Vrishchika",
    natchathiram: "Anuradha",
    gothiram: "Bharadvaja",
    primaryPhone: "9876500009",
    qualification: "B.E Mechanical",
    jobDesc: "Mechanical Engineer",
    salary: "600000+",
    bioDesc: "Young engineer and Arun's younger brother. Sports enthusiast and tech lover.",
    workPlace: "Chennai",
    nativePlace: "Kumbakonam",
    address1: "Velachery",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600042",
    citizenship: "Indian",
    kuladeivam: "Sarangapani Temple",
    enableMarriageFlag: false,
    profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
  },

  // === GENERATION 4: CHILDREN ===
  {
    firstName: "Rohan",
    lastName: "Arun",
    email: "rohan.arun@avs.com",
    mobile: "9876500010",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Male" as const,
    dob: new Date("2023-05-10"),
    placeOfBirth: "Chennai",
    timeOfBirth: "12:30",
    height: 100,
    rasi: "Vrishabha",
    natchathiram: "Rohini",
    gothiram: "Bharadvaja",
    primaryPhone: "9876500010",
    qualification: "Preschool",
    jobDesc: "Student",
    salary: "N/A",
    bioDesc: "Youngest member of the family. Arun and Priya's son, bringing joy to everyone.",
    workPlace: "N/A",
    nativePlace: "Chennai",
    address1: "Tech Park Road, OMR",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600096",
    citizenship: "Indian",
    kuladeivam: "Sarangapani Temple",
    enableMarriageFlag: false,
    profilePicture: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=150&h=150&fit=crop&crop=face"
  }
];

export async function seedCompleteFamily() {
  try {
    await connectDB();
    console.log("✅ Connected to database");

    // Clear existing data
    await User.deleteMany({});
    await Relationship.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Hash passwords and create users
    const users: typeof User.prototype[] = [];
    for (const userData of completeFamily) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const savedUser = await user.save();
      users.push(savedUser);
      console.log(`👤 Created: ${savedUser.firstName} ${savedUser.lastName}`);
    }
    console.log(`\n✅ Created ${users.length} users\n`);

    // Helper function to find user
    const findUser = (firstName: string) => users.find(u => u.firstName === firstName);

    // Get users
    const venkat = findUser('Venkataraman');
    const lakshmi = findUser('Lakshmi');
    const ramesh = findUser('Ramesh');
    const saroja = findUser('Saroja');
    const murali = findUser('Murali');
    const arun = findUser('Arun');
    const priya = findUser('Priya');
    const divya = findUser('Divya');
    const kumar = findUser('Kumar');
    const rohan = findUser('Rohan');

    // Create clean, linear relationships - NO DUPLICATES OR CONTRADICTIONS
    const relationships = [
      // === GENERATION 1: GRANDPARENTS (Spouse relationship only) ===
      {
        personId1: venkat?._id,
        personId2: lakshmi?._id,
        relationType: 'Spouse',
        description: 'Married for 50+ years',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },

      // === GENERATION 2: PARENTS (Only direct parent-child relationships) ===
      // Venkataraman & Lakshmi → Ramesh (Father & Mother)
      {
        personId1: venkat?._id,
        personId2: ramesh?._id,
        relationType: 'Father',
        description: 'Father',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },
      {
        personId1: lakshmi?._id,
        personId2: ramesh?._id,
        relationType: 'Mother',
        description: 'Mother',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },
      
      // Venkataraman & Lakshmi → Murali (Father & Mother)
      {
        personId1: venkat?._id,
        personId2: murali?._id,
        relationType: 'Father',
        description: 'Father',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },
      {
        personId1: lakshmi?._id,
        personId2: murali?._id,
        relationType: 'Mother',
        description: 'Mother',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },

      // === GENERATION 2: SIBLINGS ===
      {
        personId1: ramesh?._id,
        personId2: murali?._id,
        relationType: 'Brother',
        description: 'Brothers',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },

      // === GENERATION 2: SPOUSE ===
      {
        personId1: ramesh?._id,
        personId2: saroja?._id,
        relationType: 'Spouse',
        description: 'Married couple',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },

      // === GENERATION 3: PARENTS TO CHILDREN (Only direct relationships) ===
      // Ramesh & Saroja → Arun (Father & Mother)
      {
        personId1: ramesh?._id,
        personId2: arun?._id,
        relationType: 'Father',
        description: 'Father',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },
      {
        personId1: saroja?._id,
        personId2: arun?._id,
        relationType: 'Mother',
        description: 'Mother',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },
      
      // Ramesh & Saroja → Divya (Father & Mother)
      {
        personId1: ramesh?._id,
        personId2: divya?._id,
        relationType: 'Father',
        description: 'Father',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },
      {
        personId1: saroja?._id,
        personId2: divya?._id,
        relationType: 'Mother',
        description: 'Mother',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },
      
      // Ramesh & Saroja → Kumar (Father & Mother)
      {
        personId1: ramesh?._id,
        personId2: kumar?._id,
        relationType: 'Father',
        description: 'Father',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },
      {
        personId1: saroja?._id,
        personId2: kumar?._id,
        relationType: 'Mother',
        description: 'Mother',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },

      // === GENERATION 3: SIBLINGS (Only between siblings, not parent-child) ===
      {
        personId1: arun?._id,
        personId2: divya?._id,
        relationType: 'Sister',
        description: 'Sister',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },
      {
        personId1: arun?._id,
        personId2: kumar?._id,
        relationType: 'Brother',
        description: 'Brother',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },
      {
        personId1: divya?._id,
        personId2: kumar?._id,
        relationType: 'Brother',
        description: 'Brother',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },

      // === GENERATION 3: SPOUSE ===
      {
        personId1: arun?._id,
        personId2: priya?._id,
        relationType: 'Spouse',
        description: 'Married couple',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },

      // === GENERATION 4: PARENTS TO CHILDREN ===
      {
        personId1: arun?._id,
        personId2: rohan?._id,
        relationType: 'Father',
        description: 'Father',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      },
      {
        personId1: priya?._id,
        personId2: rohan?._id,
        relationType: 'Mother',
        description: 'Mother',
        isApproved: true,
        approvedBy: arun?._id,
        createdBy: arun?._id
      }
    ];

    // Save relationships
    let savedCount = 0;
    for (const relData of relationships) {
      if (relData.personId1 && relData.personId2) {
        const relationship = new Relationship(relData);
        await relationship.save();
        savedCount++;
      }
    }
    console.log(`\n✅ Created ${savedCount} relationships\n`);

    console.log("=" .repeat(60));
    console.log("🎉 DATABASE SEEDED SUCCESSFULLY!");
    console.log("=" .repeat(60));
    console.log("\n📊 FAMILY TREE STRUCTURE:\n");
    console.log("Generation 1 (Grandparents):");
    console.log("  👴 Venkataraman Iyer ❤️  👵 Lakshmi Venkataraman");
    console.log("           |");
    console.log("Generation 2 (Parents & Uncle):");
    console.log("  👨 Ramesh Venkataraman ❤️  👩 Saroja Ramesh");
    console.log("  👨 Murali Venkataraman (Uncle)");
    console.log("           |");
    console.log("Generation 3 (You, Spouse & Siblings):");
    console.log("  👦 Arun Ramesh (YOU) ❤️  👧 Priya Arun");
    console.log("  👧 Divya Ramesh (Sister)");
    console.log("  👦 Kumar Ramesh (Brother)");
    console.log("           |");
    console.log("Generation 4 (Children):");
    console.log("  👶 Rohan Arun (Son)");
    console.log("\n" + "=".repeat(60));
    console.log("\n🔑 LOGIN CREDENTIALS:\n");
    console.log("Main User (YOU):");
    console.log("  Email: arun.ramesh@avs.com");
    console.log("  Password: password123");
    console.log("\nAll users have the same password: password123");
    console.log("\n🌳 Visit http://localhost:3002/family-tree to see your tree!");
    console.log("=" .repeat(60) + "\n");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedCompleteFamily()
    .then(() => {
      console.log("✅ Seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}

