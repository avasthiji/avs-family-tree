import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import bcrypt from "bcryptjs";
import connectDB from "./db";
import User from "@/models/User";
import Relationship from "@/models/Relationship";
import Event from "@/models/Event";

// Dummy data based on AVS community
const dummyUsers = [
  // Admin Users
  {
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "admin@avs.com",
    mobile: "9876543210",
    password: "admin123",
    role: "admin" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Male" as const,
    dob: new Date("1980-05-15"),
    placeOfBirth: "Chennai",
    timeOfBirth: "06:30",
    height: 175,
    rasi: "Mesha",
    natchathiram: "Bharani",
    gothiram: "Kashyapa",
    primaryPhone: "9876543210",
    qualification: "MBA",
    jobDesc: "Business Owner",
    salary: "500000+",
    bioDesc: "Dedicated to serving the AVS community and preserving our heritage.",
    workPlace: "Chennai",
    nativePlace: "Thanjavur",
    address1: "123 AVS Street",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600001",
    citizenship: "Indian",
    kuladeivam: "Murugan Temple",
    enableMarriageFlag: false,
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  
  // Matchmaker
  {
    firstName: "Priya",
    lastName: "Venkatesh",
    email: "matchmaker@avs.com",
    mobile: "9876543211",
    password: "matchmaker123",
    role: "matchmaker" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Female" as const,
    dob: new Date("1985-08-22"),
    placeOfBirth: "Madurai",
    timeOfBirth: "14:15",
    height: 165,
    rasi: "Kataka",
    natchathiram: "Pushya",
    gothiram: "Kashyapa",
    primaryPhone: "9876543211",
    qualification: "MSW",
    jobDesc: "Social Worker",
    salary: "300000+",
    bioDesc: "Passionate about helping AVS families find their perfect matches.",
    workPlace: "Madurai",
    nativePlace: "Madurai",
    address1: "456 Temple Street",
    city: "Madurai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "625001",
    citizenship: "Indian",
    kuladeivam: "Meenakshi Temple",
    enableMarriageFlag: false,
    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },

  // Regular Users - Family 1
  {
    firstName: "Suresh",
    lastName: "Raman",
    email: "suresh.raman@email.com",
    mobile: "9876543212",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Male" as const,
    dob: new Date("1990-03-10"),
    placeOfBirth: "Coimbatore",
    timeOfBirth: "08:45",
    height: 178,
    rasi: "Mithuna",
    natchathiram: "Arudra",
    gothiram: "Kashyapa",
    primaryPhone: "9876543212",
    qualification: "BE Computer Science",
    jobDesc: "Software Engineer",
    salary: "800000+",
    bioDesc: "Tech enthusiast working in Bangalore. Love traditional music and dance.",
    partnerDesc: "Looking for someone who values family traditions and modern thinking.",
    workPlace: "Bangalore",
    nativePlace: "Coimbatore",
    address1: "789 Tech Park",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    postalCode: "560001",
    citizenship: "Indian",
    kuladeivam: "Perumal Temple",
    enableMarriageFlag: true,
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },

  {
    firstName: "Lakshmi",
    lastName: "Raman",
    email: "lakshmi.raman@email.com",
    mobile: "9876543213",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Female" as const,
    dob: new Date("1992-07-18"),
    placeOfBirth: "Salem",
    timeOfBirth: "11:30",
    height: 162,
    rasi: "Simha",
    natchathiram: "Magha",
    gothiram: "Kashyapa",
    primaryPhone: "9876543213",
    qualification: "B.Com",
    jobDesc: "Accountant",
    salary: "400000+",
    bioDesc: "Traditional at heart, modern in approach. Love cooking and music.",
    partnerDesc: "Seeking someone who respects traditions and has a stable career.",
    workPlace: "Salem",
    nativePlace: "Salem",
    address1: "321 Heritage Lane",
    city: "Salem",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "636001",
    citizenship: "Indian",
    kuladeivam: "Murugan Temple",
    enableMarriageFlag: true,
    profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },

  // Family 2
  {
    firstName: "Karthik",
    lastName: "Subramanian",
    email: "karthik.sub@email.com",
    mobile: "9876543214",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Male" as const,
    dob: new Date("1988-12-05"),
    placeOfBirth: "Trichy",
    timeOfBirth: "16:20",
    height: 180,
    rasi: "Dhanus",
    natchathiram: "Moola",
    gothiram: "Bharadwaja",
    primaryPhone: "9876543214",
    qualification: "MBBS",
    jobDesc: "Doctor",
    salary: "1200000+",
    bioDesc: "Doctor by profession, musician by passion. Love classical music.",
    partnerDesc: "Looking for someone who appreciates art and culture.",
    workPlace: "Chennai",
    nativePlace: "Trichy",
    address1: "654 Medical College Road",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600028",
    citizenship: "Indian",
    kuladeivam: "Rockfort Temple",
    enableMarriageFlag: true,
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  },

  {
    firstName: "Meera",
    lastName: "Krishnan",
    email: "meera.krishnan@email.com",
    mobile: "9876543215",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Female" as const,
    dob: new Date("1991-04-25"),
    placeOfBirth: "Erode",
    timeOfBirth: "09:15",
    height: 158,
    rasi: "Rishaba",
    natchathiram: "Rohini",
    gothiram: "Bharadwaja",
    primaryPhone: "9876543215",
    qualification: "MA English",
    jobDesc: "Teacher",
    salary: "350000+",
    bioDesc: "Teacher and writer. Passionate about Tamil literature and culture.",
    partnerDesc: "Seeking someone who values education and cultural heritage.",
    workPlace: "Erode",
    nativePlace: "Erode",
    address1: "987 School Street",
    city: "Erode",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "638001",
    citizenship: "Indian",
    kuladeivam: "Periyar Temple",
    enableMarriageFlag: true,
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  },

  // Family 3
  {
    firstName: "Arun",
    lastName: "Natarajan",
    email: "arun.natarajan@email.com",
    mobile: "9876543216",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Male" as const,
    dob: new Date("1987-09-12"),
    placeOfBirth: "Madurai",
    timeOfBirth: "13:45",
    height: 175,
    rasi: "Kanya",
    natchathiram: "Hasta",
    gothiram: "Kashyapa",
    primaryPhone: "9876543216",
    qualification: "BE Mechanical",
    jobDesc: "Engineer",
    salary: "700000+",
    bioDesc: "Mechanical engineer with interest in traditional architecture.",
    partnerDesc: "Looking for someone who appreciates both science and tradition.",
    workPlace: "Coimbatore",
    nativePlace: "Madurai",
    address1: "147 Industrial Area",
    city: "Coimbatore",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "641001",
    citizenship: "Indian",
    kuladeivam: "Meenakshi Temple",
    enableMarriageFlag: true,
    profilePicture: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face"
  },

  {
    firstName: "Deepa",
    lastName: "Ravi",
    email: "deepa.ravi@email.com",
    mobile: "9876543217",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: true,
    gender: "Female" as const,
    dob: new Date("1993-01-30"),
    placeOfBirth: "Tirunelveli",
    timeOfBirth: "07:20",
    height: 160,
    rasi: "Makara",
    natchathiram: "Dhanishta",
    gothiram: "Kashyapa",
    primaryPhone: "9876543217",
    qualification: "B.Sc Computer Science",
    jobDesc: "Software Developer",
    salary: "600000+",
    bioDesc: "Software developer who loves traditional dance and music.",
    partnerDesc: "Seeking someone who balances modern career with traditional values.",
    workPlace: "Hyderabad",
    nativePlace: "Tirunelveli",
    address1: "258 IT Park",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    postalCode: "500001",
    citizenship: "Indian",
    kuladeivam: "Nellaiappar Temple",
    enableMarriageFlag: true,
    profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
  },

  // Pending approval users
  {
    firstName: "Vijay",
    lastName: "Mohan",
    email: "vijay.mohan@email.com",
    mobile: "9876543218",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: false,
    gender: "Male" as const,
    dob: new Date("1989-06-14"),
    placeOfBirth: "Vellore",
    timeOfBirth: "10:30",
    height: 172,
    rasi: "Mithuna",
    natchathiram: "Punarvasu",
    gothiram: "Kashyapa",
    primaryPhone: "9876543218",
    qualification: "MBA",
    jobDesc: "Manager",
    salary: "900000+",
    bioDesc: "Business professional seeking to connect with AVS community.",
    workPlace: "Mumbai",
    nativePlace: "Vellore",
    address1: "369 Business District",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postalCode: "400001",
    citizenship: "Indian",
    kuladeivam: "Jalakandeswarar Temple",
    enableMarriageFlag: true,
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },

  {
    firstName: "Anitha",
    lastName: "Sundar",
    email: "anitha.sundar@email.com",
    mobile: "9876543219",
    password: "password123",
    role: "user" as const,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: false,
    gender: "Female" as const,
    dob: new Date("1994-11-08"),
    placeOfBirth: "Kanchipuram",
    timeOfBirth: "15:45",
    height: 155,
    rasi: "Vrischika",
    natchathiram: "Anuradha",
    gothiram: "Kashyapa",
    primaryPhone: "9876543219",
    qualification: "B.Tech IT",
    jobDesc: "IT Professional",
    salary: "550000+",
    bioDesc: "IT professional with passion for traditional crafts and arts.",
    workPlace: "Pune",
    nativePlace: "Kanchipuram",
    address1: "741 Tech Hub",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    postalCode: "411001",
    citizenship: "Indian",
    kuladeivam: "Ekambareswarar Temple",
    enableMarriageFlag: true,
    profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  }
];

const dummyEvents = [
  {
    title: "AVS Annual Family Meet 2025",
    description: "Join us for the annual AVS family gathering with cultural programs, traditional food, and networking opportunities.",
    eventDate: new Date("2025-12-25T10:00:00Z"),
    location: "Chennai Trade Centre, Chennai",
    isPublished: true
  },
  {
    title: "Traditional Music & Dance Workshop",
    description: "Learn traditional Tamil music and classical dance forms from renowned artists in the AVS community.",
    eventDate: new Date("2025-11-15T09:00:00Z"),
    location: "Kalakshetra Foundation, Chennai",
    isPublished: true
  },
  {
    title: "AVS Youth Conference",
    description: "Empowering the next generation of AVS community leaders with workshops on career development and cultural preservation.",
    eventDate: new Date("2025-10-20T08:30:00Z"),
    location: "IIT Madras, Chennai",
    isPublished: true
  },
  {
    title: "Matrimony Meet & Greet",
    description: "A special event for eligible AVS members to meet and connect in a traditional yet modern setting.",
    eventDate: new Date("2026-01-30T16:00:00Z"),
    location: "Taj Connemara, Chennai",
    isPublished: true
  }
];

export async function seedDatabase() {
  try {
    await connectDB();
    console.log("Connected to database");

    // Clear existing data
    await User.deleteMany({});
    await Relationship.deleteMany({});
    await Event.deleteMany({});
    console.log("Cleared existing data");

    // Hash passwords and create users
    const users = [];
    for (const userData of dummyUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      users.push(await user.save());
    }
    console.log(`Created ${users.length} users`);

    // Get admin user for approvals
    const adminUser = users.find(u => u.role === 'admin');
    
    // Create relationships
    const relationships = [
      // Suresh and Lakshmi are siblings
      {
        personId1: users.find(u => u.firstName === 'Suresh')?._id,
        personId2: users.find(u => u.firstName === 'Lakshmi')?._id,
        relationType: 'Sister' as const,
        isApproved: true,
        approvedBy: adminUser?._id,
        createdBy: adminUser?._id,
        updatedBy: adminUser?._id
      },
      // Karthik and Meera are siblings
      {
        personId1: users.find(u => u.firstName === 'Karthik')?._id,
        personId2: users.find(u => u.firstName === 'Meera')?._id,
        relationType: 'Sister' as const,
        isApproved: true,
        approvedBy: adminUser?._id,
        createdBy: adminUser?._id,
        updatedBy: adminUser?._id
      },
      // Arun and Deepa are cousins
      {
        personId1: users.find(u => u.firstName === 'Arun')?._id,
        personId2: users.find(u => u.firstName === 'Deepa')?._id,
        relationType: 'Cousin' as const,
        isApproved: true,
        approvedBy: adminUser?._id,
        createdBy: adminUser?._id,
        updatedBy: adminUser?._id
      }
    ];

    for (const relData of relationships) {
      if (relData.personId1 && relData.personId2) {
        const relationship = new Relationship(relData);
        await relationship.save();
      }
    }
    console.log(`Created ${relationships.length} relationships`);

    // Create events
    for (const eventData of dummyEvents) {
      const event = new Event({
        ...eventData,
        organizer: adminUser?._id,
        attendees: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await event.save();
    }
    console.log(`Created ${dummyEvents.length} events`);

    console.log("Database seeded successfully!");
    console.log("\nDemo Accounts:");
    console.log("Admin: admin@avs.com / admin123");
    console.log("Matchmaker: matchmaker@avs.com / matchmaker123");
    console.log("Users: suresh.raman@email.com / password123");
    console.log("Pending: vijay.mohan@email.com / password123");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
