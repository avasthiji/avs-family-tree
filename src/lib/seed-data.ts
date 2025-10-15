import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import bcrypt from "bcryptjs";
import connectDB from "./db";
import User from "@/models/User";
import Relationship from "@/models/Relationship";
import Event from "@/models/Event";

// Helper function to generate user data
function generateUser(
  firstName: string,
  lastName: string,
  email: string,
  mobileNum: string,
  role: "admin" | "matchmaker" | "user",
  gender: "Male" | "Female",
  dob: Date,
  placeOfBirth: string,
  timeOfBirth: string,
  height: number,
  rasi: string,
  natchathiram: string,
  gothiram: string,
  qualification: string,
  jobDesc: string,
  salary: string,
  bioDesc: string,
  workPlace: string,
  nativePlace: string,
  address: string,
  city: string,
  state: string,
  postalCode: string,
  kuladeivam: string,
  enableMarriage: boolean,
  isApproved: boolean,
  profilePic: string,
  partnerDesc?: string
) {
  return {
    firstName,
    lastName,
    email,
    mobile: mobileNum,
    password: role === "admin" ? "admin123" : role === "matchmaker" ? "matchmaker123" : "password123",
    role,
    isEmailVerified: true,
    isMobileVerified: true,
    isApprovedByAdmin: isApproved,
    gender,
    dob,
    placeOfBirth,
    timeOfBirth,
    height,
    rasi,
    natchathiram,
    gothiram,
    primaryPhone: mobileNum,
    qualification,
    jobDesc,
    salary,
    bioDesc,
    partnerDesc,
    workPlace,
    nativePlace,
    address1: address,
    city,
    state,
    country: "India",
    postalCode,
    citizenship: "Indian",
    kuladeivam,
    enableMarriageFlag: enableMarriage,
    profilePicture: profilePic
  };
}

// Dummy data based on AVS community - 100 users
const dummyUsers = [
  // 1. Admin User
  generateUser(
    "Rajesh", "Kumar", "admin@avs.com", "9876543210", "admin", "Male",
    new Date("1980-05-15"), "Chennai", "06:30", 175, "Mesha", "Bharani", "Kashyapa",
    "MBA", "Business Owner", "500000+",
    "Dedicated to serving the AVS community and preserving our heritage.",
    "Chennai", "Thanjavur", "123 AVS Street", "Chennai", "Tamil Nadu", "600001",
    "Murugan Temple", false, true,
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  ),

  // 2. Matchmaker
  generateUser(
    "Priya", "Venkatesh", "matchmaker@avs.com", "9876543211", "matchmaker", "Female",
    new Date("1985-08-22"), "Madurai", "14:15", 165, "Kataka", "Pushya", "Kashyapa",
    "MSW", "Social Worker", "300000+",
    "Passionate about helping AVS families find their perfect matches.",
    "Madurai", "Madurai", "456 Temple Street", "Madurai", "Tamil Nadu", "625001",
    "Meenakshi Temple", false, true,
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  ),

  // 3-10. Regular approved users
  generateUser(
    "Suresh", "Raman", "suresh.raman@email.com", "9876543212", "user", "Male",
    new Date("1990-03-10"), "Coimbatore", "08:45", 178, "Mithuna", "Arudra", "Kashyapa",
    "BE Computer Science", "Software Engineer", "800000+",
    "Tech enthusiast working in Bangalore. Love traditional music and dance.",
    "Bangalore", "Coimbatore", "789 Tech Park", "Bangalore", "Karnataka", "560001",
    "Perumal Temple", true, true,
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "Looking for someone who values family traditions and modern thinking."
  ),

  generateUser(
    "Lakshmi", "Raman", "lakshmi.raman@email.com", "9876543213", "user", "Female",
    new Date("1992-07-18"), "Salem", "11:30", 162, "Simha", "Magha", "Kashyapa",
    "B.Com", "Accountant", "400000+",
    "Traditional at heart, modern in approach. Love cooking and music.",
    "Salem", "Salem", "321 Heritage Lane", "Salem", "Tamil Nadu", "636001",
    "Murugan Temple", true, true,
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    "Seeking someone who respects traditions and has a stable career."
  ),

  generateUser(
    "Karthik", "Subramanian", "karthik.sub@email.com", "9876543214", "user", "Male",
    new Date("1988-12-05"), "Trichy", "16:20", 180, "Dhanus", "Moola", "Bharadwaja",
    "MBBS", "Doctor", "1200000+",
    "Doctor by profession, musician by passion. Love classical music.",
    "Chennai", "Trichy", "654 Medical College Road", "Chennai", "Tamil Nadu", "600028",
    "Rockfort Temple", true, true,
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    "Looking for someone who appreciates art and culture."
  ),

  generateUser(
    "Meera", "Krishnan", "meera.krishnan@email.com", "9876543215", "user", "Female",
    new Date("1991-04-25"), "Erode", "09:15", 158, "Rishaba", "Rohini", "Bharadwaja",
    "MA English", "Teacher", "350000+",
    "Teacher and writer. Passionate about Tamil literature and culture.",
    "Erode", "Erode", "987 School Street", "Erode", "Tamil Nadu", "638001",
    "Periyar Temple", true, true,
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    "Seeking someone who values education and cultural heritage."
  ),

  generateUser(
    "Arun", "Natarajan", "arun.natarajan@email.com", "9876543216", "user", "Male",
    new Date("1987-09-12"), "Madurai", "13:45", 175, "Kanya", "Hasta", "Kashyapa",
    "BE Mechanical", "Engineer", "700000+",
    "Mechanical engineer with interest in traditional architecture.",
    "Coimbatore", "Madurai", "147 Industrial Area", "Coimbatore", "Tamil Nadu", "641001",
    "Meenakshi Temple", true, true,
    "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    "Looking for someone who appreciates both science and tradition."
  ),

  generateUser(
    "Deepa", "Ravi", "deepa.ravi@email.com", "9876543217", "user", "Female",
    new Date("1993-01-30"), "Tirunelveli", "07:20", 160, "Makara", "Dhanishta", "Kashyapa",
    "B.Sc Computer Science", "Software Developer", "600000+",
    "Software developer who loves traditional dance and music.",
    "Hyderabad", "Tirunelveli", "258 IT Park", "Hyderabad", "Telangana", "500001",
    "Nellaiappar Temple", true, true,
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    "Seeking someone who balances modern career with traditional values."
  ),

  // Pending approval users
  generateUser(
    "Vijay", "Mohan", "vijay.mohan@email.com", "9876543218", "user", "Male",
    new Date("1989-06-14"), "Vellore", "10:30", 172, "Mithuna", "Punarvasu", "Kashyapa",
    "MBA", "Manager", "900000+",
    "Business professional seeking to connect with AVS community.",
    "Mumbai", "Vellore", "369 Business District", "Mumbai", "Maharashtra", "400001",
    "Jalakandeswarar Temple", true, false,
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "Looking for an educated partner with strong family values."
  ),

  generateUser(
    "Anitha", "Sundar", "anitha.sundar@email.com", "9876543219", "user", "Female",
    new Date("1994-11-08"), "Kanchipuram", "15:45", 155, "Vrischika", "Anuradha", "Kashyapa",
    "B.Tech IT", "IT Professional", "550000+",
    "IT professional with passion for traditional crafts and arts.",
    "Pune", "Kanchipuram", "741 Tech Hub", "Pune", "Maharashtra", "411001",
    "Ekambareswarar Temple", true, false,
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    "Seeking a caring partner who values traditions."
  ),

  // 11-100. Additional 90 users
  generateUser(
    "Ramesh", "Iyer", "ramesh.iyer@email.com", "9876543220", "user", "Male",
    new Date("1986-02-20"), "Thanjavur", "08:00", 177, "Mesha", "Ashwini", "Vatsa",
    "CA", "Chartered Accountant", "1000000+",
    "Finance professional with deep interest in temple architecture.",
    "Chennai", "Thanjavur", "45 Tank Street", "Chennai", "Tamil Nadu", "600002",
    "Brihadeeswarar Temple", true, true,
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    "Looking for an intelligent and family-oriented partner."
  ),

  generateUser(
    "Divya", "Murthy", "divya.murthy@email.com", "9876543221", "user", "Female",
    new Date("1995-05-12"), "Bangalore", "12:15", 163, "Karkata", "Ashlesha", "Bharadwaja",
    "BCA", "Software Tester", "450000+",
    "Tech professional who enjoys Bharatanatyam and classical music.",
    "Bangalore", "Mysore", "78 HSR Layout", "Bangalore", "Karnataka", "560102",
    "Chamundeshwari Temple", true, true,
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
    "Seeking a supportive partner with good family background."
  ),

  generateUser(
    "Ganesh", "Pillai", "ganesh.pillai@email.com", "9876543222", "user", "Male",
    new Date("1984-08-30"), "Kanyakumari", "05:30", 174, "Simha", "Poorva Phalguni", "Kaushika",
    "BE Civil", "Civil Engineer", "850000+",
    "Civil engineer working on infrastructure projects.",
    "Kerala", "Kanyakumari", "12 Beach Road", "Trivandrum", "Kerala", "695001",
    "Padmanabhaswamy Temple", true, true,
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    "Looking for an understanding and educated partner."
  ),

  generateUser(
    "Revathi", "Swaminathan", "revathi.swami@email.com", "9876543223", "user", "Female",
    new Date("1993-03-18"), "Puducherry", "14:45", 161, "Dhanus", "Poorvashada", "Kashyapa",
    "B.Sc Nursing", "Nurse", "380000+",
    "Healthcare professional dedicated to serving people.",
    "Puducherry", "Puducherry", "23 Nehru Street", "Puducherry", "Puducherry", "605001",
    "Manakula Vinayagar Temple", true, true,
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    "Seeking a caring and responsible life partner."
  ),

  generateUser(
    "Balaji", "Rangan", "balaji.rangan@email.com", "9876543224", "user", "Male",
    new Date("1991-11-25"), "Kumbakonam", "09:30", 176, "Tula", "Swati", "Vatsa",
    "B.Tech ECE", "Electronics Engineer", "720000+",
    "Electronics engineer with passion for photography.",
    "Bangalore", "Kumbakonam", "56 Electronics City", "Bangalore", "Karnataka", "560100",
    "Sarangapani Temple", true, true,
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
    "Looking for a cheerful partner who loves life."
  ),

  generateUser(
    "Sangeetha", "Balakrishnan", "sangeetha.bala@email.com", "9876543225", "user", "Female",
    new Date("1990-07-08"), "Karur", "16:00", 159, "Kumbha", "Shatabhisha", "Bharadwaja",
    "MBA Finance", "Financial Analyst", "680000+",
    "Finance professional who loves cooking and gardening.",
    "Chennai", "Karur", "89 Anna Nagar", "Chennai", "Tamil Nadu", "600040",
    "Kalyana Pasupatheeswarar Temple", true, true,
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    "Seeking a kind-hearted partner with good values."
  ),

  generateUser(
    "Prakash", "Sundaram", "prakash.sundaram@email.com", "9876543226", "user", "Male",
    new Date("1985-04-16"), "Dindigul", "11:00", 179, "Meena", "Revati", "Kashyapa",
    "M.Sc Physics", "Research Scientist", "580000+",
    "Scientist working in renewable energy research.",
    "Chennai", "Dindigul", "34 Velachery", "Chennai", "Tamil Nadu", "600042",
    "Kodai Temple", true, true,
    "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=150&h=150&fit=crop&crop=face",
    "Looking for an intelligent and understanding partner."
  ),

  generateUser(
    "Kavitha", "Narayanan", "kavitha.narayan@email.com", "9876543227", "user", "Female",
    new Date("1992-09-22"), "Namakkal", "07:45", 157, "Rishaba", "Krittika", "Kaushika",
    "B.Ed", "School Teacher", "320000+",
    "Primary school teacher who loves working with children.",
    "Namakkal", "Namakkal", "67 School Street", "Namakkal", "Tamil Nadu", "637001",
    "Anjaneyar Temple", true, true,
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    "Seeking an educated partner who respects teaching profession."
  ),

  generateUser(
    "Senthil", "Kumar", "senthil.kumar@email.com", "9876543228", "user", "Male",
    new Date("1988-12-30"), "Rajapalayam", "13:20", 173, "Mithuna", "Mrigashirsha", "Vatsa",
    "B.Com CA", "Bank Manager", "750000+",
    "Banking professional with interest in sports.",
    "Madurai", "Rajapalayam", "45 Main Street", "Madurai", "Tamil Nadu", "625002",
    "Rajagopalaswamy Temple", true, true,
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "Looking for a supportive and caring life partner."
  ),

  generateUser(
    "Preethi", "Raghavan", "preethi.raghavan@email.com", "9876543229", "user", "Female",
    new Date("1994-01-14"), "Cuddalore", "10:15", 164, "Karkata", "Pushya", "Bharadwaja",
    "BDS", "Dentist", "920000+",
    "Dental surgeon with own clinic.",
    "Chennai", "Cuddalore", "23 T Nagar", "Chennai", "Tamil Nadu", "600017",
    "Padaleeswarar Temple", true, true,
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    "Seeking a well-educated partner from good family."
  ),

  generateUser(
    "Mohan", "Selvaraj", "mohan.selvaraj@email.com", "9876543230", "user", "Male",
    new Date("1987-06-05"), "Villupuram", "06:00", 175, "Simha", "Uttara Phalguni", "Kashyapa",
    "Diploma Mechanical", "Production Manager", "650000+",
    "Manufacturing professional with 12 years experience.",
    "Hosur", "Villupuram", "78 Industrial Estate", "Hosur", "Tamil Nadu", "635109",
    "Thiruvakkarai Temple", true, true,
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    "Looking for a traditional yet modern thinking partner."
  ),

  generateUser(
    "Vasanthi", "Parthasarathy", "vasanthi.partha@email.com", "9876543231", "user", "Female",
    new Date("1991-10-28"), "Nagapattinam", "15:30", 160, "Kanya", "Uttara Phalguni", "Vatsa",
    "M.Sc Chemistry", "Lab Technician", "420000+",
    "Chemistry graduate working in pharmaceutical industry.",
    "Chennai", "Nagapattinam", "12 Porur", "Chennai", "Tamil Nadu", "600116",
    "Sikkal Temple", true, true,
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    "Seeking a well-settled partner with good family background."
  ),

  generateUser(
    "Vignesh", "Ramachandran", "vignesh.rama@email.com", "9876543232", "user", "Male",
    new Date("1989-03-07"), "Thoothukudi", "08:20", 181, "Tula", "Chitra", "Kaushika",
    "BE EEE", "Electrical Engineer", "780000+",
    "Electrical engineer in power sector company.",
    "Tuticorin", "Thoothukudi", "56 Power House Road", "Tuticorin", "Tamil Nadu", "628001",
    "Tiruchendur Temple", true, true,
    "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    "Looking for an educated and cultured life partner."
  ),

  generateUser(
    "Nithya", "Venkatesan", "nithya.venkat@email.com", "9876543233", "user", "Female",
    new Date("1993-08-19"), "Sivakasi", "12:45", 156, "Vrischika", "Jyeshtha", "Bharadwaja",
    "B.Sc Mathematics", "Mathematics Teacher", "340000+",
    "High school mathematics teacher with 5 years experience.",
    "Sivakasi", "Sivakasi", "34 Bypass Road", "Sivakasi", "Tamil Nadu", "626123",
    "Badrakali Temple", true, true,
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    "Seeking a well-mannered and family-oriented partner."
  ),

  generateUser(
    "Rajendran", "Gopinath", "rajendran.gopi@email.com", "9876543234", "user", "Male",
    new Date("1986-11-11"), "Dharmapuri", "09:00", 172, "Dhanus", "Moola", "Kashyapa",
    "ITI Fitter", "Maintenance Engineer", "480000+",
    "Skilled technician in automobile industry.",
    "Bangalore", "Dharmapuri", "90 Peenya", "Bangalore", "Karnataka", "560058",
    "Subramanya Temple", true, true,
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "Looking for a simple and caring life partner."
  ),

  generateUser(
    "Indira", "Shankar", "indira.shankar@email.com", "9876543235", "user", "Female",
    new Date("1990-05-03"), "Krishnagiri", "14:00", 162, "Makara", "Shravana", "Vatsa",
    "MBA HR", "HR Manager", "820000+",
    "HR professional with expertise in talent management.",
    "Bangalore", "Krishnagiri", "45 Whitefield", "Bangalore", "Karnataka", "560066",
    "Krishnagiri Temple", true, true,
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    "Seeking a mature and understanding life partner."
  ),

  generateUser(
    "Mahesh", "Babu", "mahesh.babu@email.com", "9876543236", "user", "Male",
    new Date("1992-02-15"), "Ariyalur", "06:30", 178, "Kumbha", "Poorvabhadra", "Kaushika",
    "B.Tech Automobile", "Automobile Engineer", "710000+",
    "Automobile engineer working in design department.",
    "Chennai", "Ariyalur", "67 Ambattur", "Chennai", "Tamil Nadu", "600053",
    "Keezhayur Temple", true, true,
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    "Looking for a cheerful partner who loves family."
  ),

  generateUser(
    "Archana", "Subramani", "archana.subramani@email.com", "9876543237", "user", "Female",
    new Date("1995-07-21"), "Perambalur", "11:45", 158, "Meena", "Uttarabhadra", "Bharadwaja",
    "B.Pharm", "Pharmacist", "390000+",
    "Hospital pharmacist with strong medical knowledge.",
    "Trichy", "Perambalur", "23 Cantonment", "Trichy", "Tamil Nadu", "620001",
    "Arulmigu Temple", true, true,
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    "Seeking a caring partner with stable career."
  ),

  generateUser(
    "Sivakumar", "Thangavel", "sivakumar.thanga@email.com", "9876543238", "user", "Male",
    new Date("1984-09-09"), "Pudukkottai", "16:15", 174, "Mesha", "Bharani", "Kashyapa",
    "M.Com", "Business Analyst", "690000+",
    "Business analyst in IT consulting firm.",
    "Chennai", "Pudukkottai", "89 Nungambakkam", "Chennai", "Tamil Nadu", "600034",
    "Koodal Azhagar Temple", true, true,
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "Looking for an understanding and supportive partner."
  ),

  generateUser(
    "Malathi", "Viswanathan", "malathi.viswa@email.com", "9876543239", "user", "Female",
    new Date("1991-12-12"), "Karaikudi", "07:30", 161, "Rishaba", "Rohini", "Vatsa",
    "B.Sc Botany", "Research Assistant", "360000+",
    "Botanical researcher working in agricultural university.",
    "Madurai", "Karaikudi", "45 Anna Nagar", "Madurai", "Tamil Nadu", "625020",
    "Pillayarpatti Temple", true, true,
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    "Seeking an educated partner who values nature."
  ),

  generateUser(
    "Saravanan", "Murugan", "saravanan.murugan@email.com", "9876543240", "user", "Male",
    new Date("1988-04-26"), "Tiruvarur", "13:00", 176, "Mithuna", "Arudra", "Kaushika",
    "BE IT", "Systems Administrator", "670000+",
    "IT professional managing enterprise systems.",
    "Chennai", "Tiruvarur", "12 OMR", "Chennai", "Tamil Nadu", "600097",
    "Thyagaraja Temple", true, true,
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "Looking for a compatible partner with good values."
  ),

  generateUser(
    "Jayanthi", "Kannan", "jayanthi.kannan@email.com", "9876543241", "user", "Female",
    new Date("1994-06-30"), "Mayiladuthurai", "10:30", 163, "Karkata", "Ashlesha", "Bharadwaja",
    "BSW", "Social Worker", "310000+",
    "Social worker in NGO working for women empowerment.",
    "Mayiladuthurai", "Mayiladuthurai", "67 Bazaar Street", "Mayiladuthurai", "Tamil Nadu", "609001",
    "Mayuranathaswamy Temple", true, true,
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    "Seeking a socially responsible and caring partner."
  ),

  generateUser(
    "Anand", "Srinivasan", "anand.srinivasan@email.com", "9876543242", "user", "Male",
    new Date("1987-01-18"), "Virudhunagar", "08:45", 177, "Simha", "Magha", "Kashyapa",
    "LLB", "Lawyer", "880000+",
    "Practicing lawyer specializing in civil cases.",
    "Madurai", "Virudhunagar", "34 Court Road", "Madurai", "Tamil Nadu", "625001",
    "Arulmigu Temple", true, true,
    "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    "Looking for an educated and independent partner."
  ),

  generateUser(
    "Shanthi", "Rajaram", "shanthi.rajaram@email.com", "9876543243", "user", "Female",
    new Date("1992-11-05"), "Sivaganga", "15:15", 159, "Kanya", "Hasta", "Vatsa",
    "MSc Microbiology", "Microbiologist", "510000+",
    "Microbiologist in diagnostic laboratory.",
    "Chennai", "Sivaganga", "78 Adyar", "Chennai", "Tamil Nadu", "600020",
    "Karpaga Vinayagar Temple", true, true,
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    "Seeking a well-educated and understanding partner."
  ),

  generateUser(
    "Gopal", "Ramasamy", "gopal.ramasamy@email.com", "9876543244", "user", "Male",
    new Date("1985-08-14"), "Ramanathapuram", "12:00", 175, "Tula", "Vishakha", "Kaushika",
    "B.Tech Civil", "Project Manager", "950000+",
    "Civil engineer managing large infrastructure projects.",
    "Chennai", "Ramanathapuram", "56 Guindy", "Chennai", "Tamil Nadu", "600032",
    "Ramanathaswamy Temple", true, true,
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    "Looking for a cultured and family-oriented partner."
  ),

  generateUser(
    "Sudha", "Ananthan", "sudha.ananthan@email.com", "9876543245", "user", "Female",
    new Date("1993-03-28"), "Theni", "09:20", 157, "Vrischika", "Anuradha", "Bharadwaja",
    "B.Sc Agriculture", "Agricultural Officer", "380000+",
    "Agriculture graduate working in government department.",
    "Theni", "Theni", "23 Gandhi Nagar", "Theni", "Tamil Nadu", "625531",
    "Vaigai Dam Temple", true, true,
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    "Seeking a simple and hardworking life partner."
  ),

  generateUser(
    "Krishna", "Moorthy", "krishna.moorthy@email.com", "9876543246", "user", "Male",
    new Date("1990-10-17"), "Nilgiris", "06:45", 179, "Dhanus", "Poorvashada", "Kashyapa",
    "Hotel Management", "Hotel Manager", "720000+",
    "Hospitality professional managing 4-star hotel.",
    "Ooty", "Nilgiris", "12 Charring Cross", "Ooty", "Tamil Nadu", "643001",
    "Mariamman Temple", true, true,
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "Looking for a pleasant and adjustable partner."
  ),

  generateUser(
    "Geetha", "Sekar", "geetha.sekar@email.com", "9876543247", "user", "Female",
    new Date("1989-05-24"), "Coimbatore", "14:30", 162, "Makara", "Uttarashada", "Vatsa",
    "M.A Tamil", "Tamil Lecturer", "430000+",
    "College lecturer passionate about Tamil language.",
    "Coimbatore", "Coimbatore", "45 RS Puram", "Coimbatore", "Tamil Nadu", "641002",
    "Perur Temple", true, true,
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    "Seeking a cultured partner who respects Tamil heritage."
  ),

  generateUser(
    "Karthikeyan", "Pandian", "karthikeyan.pandian@email.com", "9876543248", "user", "Male",
    new Date("1986-12-20"), "Tiruppur", "11:15", 173, "Kumbha", "Shatabhisha", "Kaushika",
    "Textile Engineering", "Production Head", "890000+",
    "Textile engineer in garment export company.",
    "Tiruppur", "Tiruppur", "67 Textile Park", "Tiruppur", "Tamil Nadu", "641601",
    "Avinashi Temple", true, true,
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "Looking for a traditional partner with modern outlook."
  ),

  generateUser(
    "Poongodi", "Venkatachalam", "poongodi.venkat@email.com", "9876543249", "user", "Female",
    new Date("1994-09-08"), "Pollachi", "07:00", 160, "Meena", "Revati", "Bharadwaja",
    "B.Sc Zoology", "Lab Assistant", "330000+",
    "Laboratory assistant in veterinary college.",
    "Pollachi", "Pollachi", "89 Market Street", "Pollachi", "Tamil Nadu", "642001",
    "Masani Amman Temple", true, true,
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    "Seeking a caring and responsible life partner."
  ),

  generateUser(
    "Murali", "Dhandapani", "murali.dhandapani@email.com", "9876543250", "user", "Male",
    new Date("1988-07-03"), "Erode", "16:45", 176, "Mesha", "Krittika", "Kashyapa",
    "B.E Textile", "Quality Manager", "740000+",
    "Quality control manager in textile mill.",
    "Erode", "Erode", "34 Textile Colony", "Erode", "Tamil Nadu", "638001",
    "Sangameswarar Temple", true, true,
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    "Looking for a homely and caring partner."
  ),

  generateUser(
    "Bharathi", "Loganathan", "bharathi.logan@email.com", "9876543251", "user", "Female",
    new Date("1991-02-25"), "Namakkal", "13:30", 158, "Rishaba", "Mrigashirsha", "Vatsa",
    "B.Ed Tamil", "Primary Teacher", "315000+",
    "Primary school teacher with 7 years experience.",
    "Namakkal", "Namakkal", "56 School Road", "Namakkal", "Tamil Nadu", "637002",
    "Kolli Hills Temple", true, true,
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    "Seeking a well-mannered and family-oriented partner."
  ),

  generateUser(
    "Subramani", "Eswaran", "subramani.eswaran@email.com", "9876543252", "user", "Male",
    new Date("1983-11-30"), "Karur", "08:15", 174, "Mithuna", "Punarvasu", "Kaushika",
    "Diploma Textile", "Supervisor", "520000+",
    "Production supervisor in textile industry.",
    "Karur", "Karur", "78 Bypass Road", "Karur", "Tamil Nadu", "639001",
    "Pasupathieswarar Temple", false, true,
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  ),

  generateUser(
    "Kamala", "Sundaresan", "kamala.sundaresan@email.com", "9876543253", "user", "Female",
    new Date("1995-04-11"), "Salem", "10:00", 156, "Karkata", "Pushya", "Bharadwaja",
    "B.Sc Home Science", "Dietician", "370000+",
    "Clinical dietician in multi-specialty hospital.",
    "Salem", "Salem", "12 Fairlands", "Salem", "Tamil Nadu", "636016",
    "Sugavaneswarar Temple", true, true,
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    "Seeking a health-conscious and caring partner."
  ),

  generateUser(
    "Natarajan", "Kalyan", "natarajan.kalyan@email.com", "9876543254", "user", "Male",
    new Date("1987-06-16"), "Rasipuram", "15:00", 178, "Simha", "Poorva Phalguni", "Kashyapa",
    "BE Mechanical", "Maintenance Manager", "710000+",
    "Mechanical engineer in sugar factory.",
    "Salem", "Rasipuram", "45 Main Road", "Salem", "Tamil Nadu", "636303",
    "Eramalainathar Temple", true, true,
    "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    "Looking for a simple and understanding partner."
  ),

  generateUser(
    "Lalitha", "Manickam", "lalitha.manickam@email.com", "9876543255", "user", "Female",
    new Date("1992-08-29"), "Mettur", "12:30", 161, "Kanya", "Uttara Phalguni", "Vatsa",
    "B.Sc Physics", "Physics Teacher", "335000+",
    "High school physics teacher.",
    "Mettur", "Mettur", "67 Dam Road", "Mettur", "Tamil Nadu", "636401",
    "Mettur Dam Temple", true, true,
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    "Seeking an educated and kind-hearted partner."
  ),

  generateUser(
    "Vinayagam", "Palani", "vinayagam.palani@email.com", "9876543256", "user", "Male",
    new Date("1984-10-05"), "Sankagiri", "06:20", 175, "Tula", "Chitra", "Kaushika",
    "B.Com", "Accountant", "560000+",
    "Senior accountant in manufacturing company.",
    "Salem", "Sankagiri", "23 Fort Road", "Salem", "Tamil Nadu", "637301",
    "Sankagiri Fort Temple", true, true,
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    "Looking for a family-oriented life partner."
  ),

  generateUser(
    "Jaya", "Sivakumar", "jaya.sivakumar@email.com", "9876543257", "user", "Female",
    new Date("1993-12-01"), "Attur", "09:45", 159, "Vrischika", "Jyeshtha", "Bharadwaja",
    "BBA", "Office Administrator", "410000+",
    "Office administrator in private company.",
    "Salem", "Attur", "89 Bazaar Street", "Salem", "Tamil Nadu", "636102",
    "Kumaramangalam Temple", true, true,
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    "Seeking a well-settled and caring partner."
  ),

  generateUser(
    "Chandran", "Velmurugan", "chandran.velmurugan@email.com", "9876543258", "user", "Male",
    new Date("1989-03-19"), "Yercaud", "14:15", 172, "Dhanus", "Moola", "Kashyapa",
    "Tourism Management", "Tour Manager", "480000+",
    "Tourism professional managing hill station tours.",
    "Yercaud", "Yercaud", "12 Lake View", "Yercaud", "Tamil Nadu", "636601",
    "Servarayan Temple", true, true,
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "Looking for an adventurous and cheerful partner."
  ),

  generateUser(
    "Pavithra", "Aravind", "pavithra.aravind@email.com", "9876543259", "user", "Female",
    new Date("1990-07-27"), "Hosur", "11:00", 163, "Makara", "Shravana", "Vatsa",
    "B.Sc Computer Science", "Software Engineer", "850000+",
    "Software engineer in product company.",
    "Bangalore", "Hosur", "56 Electronic City", "Bangalore", "Karnataka", "560100",
    "Chandira Choodeswarar Temple", true, true,
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    "Seeking a technically sound and understanding partner."
  ),

  generateUser(
    "Mani", "Palanisamy", "mani.palanisamy@email.com", "9876543260", "user", "Male",
    new Date("1985-05-13"), "Dharmapuri", "07:30", 177, "Kumbha", "Dhanishta", "Kaushika",
    "B.Tech Chemical", "Chemical Engineer", "790000+",
    "Chemical engineer in pharmaceutical company.",
    "Bangalore", "Dharmapuri", "34 Hogenakkal", "Bangalore", "Karnataka", "560058",
    "Adhiyaman Kottai Temple", true, true,
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "Looking for an educated and adjustable partner."
  ),

  generateUser(
    "Sumathi", "Manikandan", "sumathi.manikandan@email.com", "9876543261", "user", "Female",
    new Date("1994-01-08"), "Krishnagiri", "16:20", 157, "Meena", "Poorvabhadra", "Bharadwaja",
    "B.Sc Biotechnology", "Research Scholar", "290000+",
    "PhD scholar in biotechnology.",
    "Bangalore", "Krishnagiri", "78 Jayanagar", "Bangalore", "Karnataka", "560041",
    "Krishnagiri Reservoir", true, true,
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    "Seeking a supportive and well-educated partner."
  ),

  generateUser(
    "Prabhu", "Ganesan", "prabhu.ganesan@email.com", "9876543262", "user", "Male",
    new Date("1988-11-22"), "Harur", "13:45", 176, "Mesha", "Ashwini", "Kashyapa",
    "BE EEE", "Electrical Engineer", "680000+",
    "Electrical engineer in power generation.",
    "Dharmapuri", "Harur", "23 Power Station Road", "Dharmapuri", "Tamil Nadu", "636903",
    "Kariyanur Temple", true, true,
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    "Looking for a traditional and caring life partner."
  ),

  generateUser(
    "Selvi", "Muthu", "selvi.muthu@email.com", "9876543263", "user", "Female",
    new Date("1991-09-15"), "Pennagaram", "10:15", 160, "Rishaba", "Bharani", "Vatsa",
    "M.A History", "History Lecturer", "390000+",
    "College history lecturer.",
    "Dharmapuri", "Pennagaram", "45 College Road", "Dharmapuri", "Tamil Nadu", "635810",
    "Hanumantharayan Kottai", true, true,
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    "Seeking a well-educated partner who values history."
  ),

  generateUser(
    "Dinesh", "Arumugam", "dinesh.arumugam@email.com", "9876543264", "user", "Male",
    new Date("1987-02-28"), "Denkanikottai", "06:00", 174, "Mithuna", "Krittika", "Kaushika",
    "Forestry Degree", "Forest Officer", "610000+",
    "Forest department officer protecting wildlife.",
    "Krishnagiri", "Denkanikottai", "67 Forest Range", "Krishnagiri", "Tamil Nadu", "635114",
    "Forest Temple", true, true,
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "Looking for a nature-loving and caring partner."
  ),

  generateUser(
    "Chitra", "Thangaraj", "chitra.thangaraj@email.com", "9876543265", "user", "Female",
    new Date("1992-12-18"), "Pochampalli", "15:30", 162, "Karkata", "Mrigashirsha", "Bharadwaja",
    "B.Des Fashion", "Fashion Designer", "530000+",
    "Fashion designer with own boutique.",
    "Krishnagiri", "Pochampalli", "12 Textile Street", "Krishnagiri", "Tamil Nadu", "635301",
    "Mallikarjuna Temple", true, true,
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    "Seeking a creative and understanding life partner."
  ),

  generateUser(
    "Arivazhagan", "Manoharan", "ariv.manoharan@email.com", "9876543266", "user", "Male",
    new Date("1986-04-04"), "Vellore", "12:00", 179, "Simha", "Arudra", "Kashyapa",
    "M.Tech CSE", "Software Architect", "1450000+",
    "Senior software architect in MNC.",
    "Bangalore", "Vellore", "89 VIT Road", "Bangalore", "Karnataka", "560103",
    "Jalakandeswarar Temple", true, true,
    "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    "Looking for an educated and compatible partner."
  ),

  generateUser(
    "Radhika", "Siva", "radhika.siva@email.com", "9876543267", "user", "Female",
    new Date("1993-06-09"), "Ranipet", "08:30", 158, "Kanya", "Punarvasu", "Vatsa",
    "B.Pharma", "Pharmacist", "420000+",
    "Pharmacist in private hospital.",
    "Vellore", "Ranipet", "34 Gandhi Road", "Vellore", "Tamil Nadu", "632401",
    "Lakshmi Narasimha Temple", true, true,
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    "Seeking a caring and responsible life partner."
  ),

  generateUser(
    "Murugesan", "Chinnaswamy", "murugesan.chinna@email.com", "9876543268", "user", "Male",
    new Date("1989-08-31"), "Ambur", "14:45", 173, "Tula", "Pushya", "Kaushika",
    "Leather Technology", "Production Manager", "770000+",
    "Manager in leather goods manufacturing.",
    "Ambur", "Ambur", "56 Leather Park", "Ambur", "Tamil Nadu", "635802",
    "Jama Masjid", true, true,
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    "Looking for a supportive and understanding partner."
  ),

  generateUser(
    "Jothi", "Muthusamy", "jothi.muthu@email.com", "9876543269", "user", "Female",
    new Date("1990-10-24"), "Vaniyambadi", "11:20", 161, "Vrischika", "Ashlesha", "Bharadwaja",
    "B.Com CA", "Tax Consultant", "490000+",
    "Tax consultant with own practice.",
    "Vellore", "Vaniyambadi", "78 Bazaar Street", "Vellore", "Tamil Nadu", "635751",
    "Jalakanteswarar Temple", true, true,
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    "Seeking a well-educated and stable partner."
  ),

  generateUser(
    "Elangovan", "Periyasamy", "elangovan.periya@email.com", "9876543270", "user", "Male",
    new Date("1984-12-07"), "Tirupattur", "06:45", 175, "Dhanus", "Magha", "Kashyapa",
    "BE Civil", "Site Engineer", "620000+",
    "Civil engineer handling construction projects.",
    "Tirupattur", "Tirupattur", "23 NH Road", "Tirupattur", "Tamil Nadu", "635601",
    "Ratnagiri Temple", true, true,
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "Looking for a simple and family-oriented partner."
  ),

  generateUser(
    "Rajalakshmi", "Palanivel", "rajalakshmi.palanivel@email.com", "9876543271", "user", "Female",
    new Date("1995-02-14"), "Gudiyatham", "09:00", 164, "Makara", "Poorva Phalguni", "Vatsa",
    "B.Sc Nursing", "Staff Nurse", "340000+",
    "Staff nurse in government hospital.",
    "Vellore", "Gudiyatham", "45 Hospital Road", "Vellore", "Tamil Nadu", "632602",
    "Vellore Fort Temple", true, true,
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    "Seeking a caring partner who values healthcare."
  ),

  generateUser(
    "Veeramani", "Jeyakumar", "veeramani.jeyakumar@email.com", "9876543272", "user", "Male",
    new Date("1988-05-20"), "Arakkonam", "16:10", 176, "Kumbha", "Uttara Phalguni", "Kaushika",
    "BE Mech", "Quality Engineer", "710000+",
    "Quality engineer in railway coach factory.",
    "Arakkonam", "Arakkonam", "67 Railway Colony", "Arakkonam", "Tamil Nadu", "631001",
    "Sundaravarada Perumal Temple", true, true,
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "Looking for a homely and understanding partner."
  ),

  generateUser(
    "Thenmozhi", "Sakthivel", "thenmozhi.sakthivel@email.com", "9876543273", "user", "Female",
    new Date("1991-07-11"), "Sholinghur", "13:25", 159, "Meena", "Hasta", "Bharadwaja",
    "M.A Economics", "Economics Lecturer", "410000+",
    "College economics lecturer.",
    "Vellore", "Sholinghur", "12 Hill Road", "Vellore", "Tamil Nadu", "631102",
    "Yoga Narasimha Temple", true, true,
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    "Seeking an educated and spiritual partner."
  ),

  generateUser(
    "Pandian", "Ravi", "pandian.ravi@email.com", "9876543274", "user", "Male",
    new Date("1986-09-03"), "Walajapet", "10:40", 178, "Mesha", "Chitra", "Kashyapa",
    "Diploma EEE", "Electrician", "450000+",
    "Senior electrician in manufacturing unit.",
    "Walajapet", "Walajapet", "89 Industrial Area", "Walajapet", "Tamil Nadu", "632513",
    "Siva Temple", false, true,
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  ),

  generateUser(
    "Karpagam", "Natraj", "karpagam.natraj@email.com", "9876543275", "user", "Female",
    new Date("1994-11-16"), "Kancheepuram", "07:15", 160, "Rishaba", "Vishakha", "Vatsa",
    "B.Sc Silk Technology", "Silk Quality Inspector", "360000+",
    "Quality inspector in silk weaving unit.",
    "Kancheepuram", "Kancheepuram", "34 Silk Street", "Kancheepuram", "Tamil Nadu", "631501",
    "Kamakshi Amman Temple", true, true,
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    "Seeking a traditional and caring life partner."
  ),

  generateUser(
    "Rajan", "Jayapal", "rajan.jayapal@email.com", "9876543276", "user", "Male",
    new Date("1987-01-29"), "Sriperumbudur", "15:50", 174, "Mithuna", "Swati", "Kaushika",
    "BE IT", "IT Analyst", "820000+",
    "IT analyst in software company.",
    "Chennai", "Sriperumbudur", "56 IT Highway", "Chennai", "Tamil Nadu", "602105",
    "Adi Kesava Perumal Temple", true, true,
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "Looking for an educated and compatible partner."
  ),

  generateUser(
    "Renuka", "Babu", "renuka.babu@email.com", "9876543277", "user", "Female",
    new Date("1992-04-02"), "Chengalpattu", "12:05", 163, "Karkata", "Anuradha", "Bharadwaja",
    "MBA Marketing", "Marketing Executive", "580000+",
    "Marketing professional in FMCG company.",
    "Chennai", "Chengalpattu", "78 GST Road", "Chennai", "Tamil Nadu", "603001",
    "Singaperumal Koil", true, true,
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    "Seeking a well-settled and understanding partner."
  ),

  generateUser(
    "Venkatesh", "Radhakrishnan", "venkatesh.radha@email.com", "9876543278", "user", "Male",
    new Date("1985-06-27"), "Tambaram", "08:35", 177, "Simha", "Jyeshtha", "Kashyapa",
    "M.Tech ECE", "Hardware Engineer", "920000+",
    "Hardware engineer in electronics company.",
    "Chennai", "Tambaram", "23 East Tambaram", "Chennai", "Tamil Nadu", "600059",
    "Sivan Temple", true, true,
    "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    "Looking for a technically inclined and caring partner."
  ),

  generateUser(
    "Mangai", "Paramasivam", "mangai.param@email.com", "9876543279", "user", "Female",
    new Date("1993-08-12"), "Pallavaram", "14:20", 157, "Kanya", "Moola", "Vatsa",
    "B.Sc Biology", "Lab Technician", "380000+",
    "Medical lab technician in diagnostic center.",
    "Chennai", "Pallavaram", "45 Chromepet", "Chennai", "Tamil Nadu", "600044",
    "Varadharaja Perumal Temple", true, true,
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    "Seeking a caring and responsible life partner."
  ),

  generateUser(
    "Sathish", "Kandasamy", "sathish.kandasamy@email.com", "9876543280", "user", "Male",
    new Date("1990-12-25"), "Poonamallee", "11:30", 175, "Tula", "Poorvashada", "Kaushika",
    "MBA Finance", "Finance Manager", "1100000+",
    "Finance manager in automobile company.",
    "Chennai", "Poonamallee", "67 Trunk Road", "Chennai", "Tamil Nadu", "600056",
    "Thiruvalleeswarar Temple", true, true,
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    "Looking for an educated and family-oriented partner."
  ),

  generateUser(
    "Devika", "Ramesh", "devika.ramesh@email.com", "9876543281", "user", "Female",
    new Date("1989-03-17"), "Avadi", "06:20", 162, "Vrischika", "Uttarashada", "Bharadwaja",
    "BDS", "Dental Surgeon", "950000+",
    "Dental surgeon with own clinic.",
    "Chennai", "Avadi", "89 CTH Road", "Chennai", "Tamil Nadu", "600054",
    "Siva Vishnu Temple", true, true,
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    "Seeking a well-educated and understanding partner."
  ),

  generateUser(
    "Kumaran", "Velan", "kumaran.velan@email.com", "9876543282", "user", "Male",
    new Date("1988-10-08"), "Tiruvallur", "09:15", 176, "Dhanus", "Shravana", "Kashyapa",
    "B.Tech Automobile", "Design Engineer", "780000+",
    "Design engineer in automotive R&D.",
    "Chennai", "Tiruvallur", "12 Redhills", "Chennai", "Tamil Nadu", "600052",
    "Veeraraghava Perumal Temple", true, true,
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "Looking for a compatible and adjustable partner."
  ),

  generateUser(
    "Yamuna", "Sampath", "yamuna.sampath@email.com", "9876543283", "user", "Female",
    new Date("1991-05-19"), "Madhavaram", "16:00", 158, "Makara", "Dhanishta", "Vatsa",
    "B.Sc Mathematics", "Maths Teacher", "350000+",
    "High school mathematics teacher.",
    "Chennai", "Madhavaram", "34 Milk Colony", "Chennai", "Tamil Nadu", "600060",
    "Lakshmikanthan Temple", true, true,
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    "Seeking a well-educated and supportive partner."
  ),

  generateUser(
    "Selvam", "Govindaraj", "selvam.govindaraj@email.com", "9876543284", "user", "Male",
    new Date("1986-07-21"), "Ponneri", "13:40", 173, "Kumbha", "Poorvabhadra", "Kaushika",
    "Diploma Mech", "Workshop Supervisor", "510000+",
    "Workshop supervisor in automobile service.",
    "Chennai", "Ponneri", "78 NH Road", "Chennai", "Tamil Nadu", "601204",
    "Siva Temple", true, true,
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "Looking for a simple and caring life partner."
  ),

  generateUser(
    "Pushpa", "Vasu", "pushpa.vasu@email.com", "9876543285", "user", "Female",
    new Date("1994-09-26"), "Gummidipoondi", "10:25", 161, "Meena", "Uttarabhadra", "Bharadwaja",
    "B.Com", "Office Secretary", "380000+",
    "Secretary in private firm.",
    "Chennai", "Gummidipoondi", "56 Market Road", "Chennai", "Tamil Nadu", "601201",
    "Parthasarathy Temple", true, true,
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    "Seeking a well-mannered and caring partner."
  ),

  generateUser(
    "Thiru", "Srinivasan", "thiru.srinivasan@email.com", "9876543286", "user", "Male",
    new Date("1992-11-13"), "Red Hills", "07:00", 179, "Mesha", "Revati", "Kashyapa",
    "BE CSE", "Software Developer", "900000+",
    "Full stack developer in product startup.",
    "Chennai", "Red Hills", "23 Lake View", "Chennai", "Tamil Nadu", "600052",
    "Karumariamman Temple", true, true,
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    "Looking for a tech-savvy and understanding partner."
  ),

  generateUser(
    "Usha", "Mahadevan", "usha.mahadevan@email.com", "9876543287", "user", "Female",
    new Date("1987-02-05"), "Uthukottai", "15:35", 160, "Rishaba", "Ashwini", "Vatsa",
    "M.A Sociology", "Social Science Lecturer", "440000+",
    "College sociology lecturer.",
    "Tiruvallur", "Uthukottai", "45 College Road", "Tiruvallur", "Tamil Nadu", "601302",
    "Bangaru Kamakshi Temple", true, true,
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    "Seeking an educated partner who values social work."
  ),

  generateUser(
    "Kannan", "Duraisamy", "kannan.duraisamy@email.com", "9876543288", "user", "Male",
    new Date("1983-08-18"), "Tiruttani", "12:15", 174, "Mithuna", "Bharani", "Kaushika",
    "B.Tech Textile", "Production Executive", "620000+",
    "Production executive in garment factory.",
    "Tiruvallur", "Tiruttani", "67 Arakkonam Road", "Tiruvallur", "Tamil Nadu", "631209",
    "Tiruttani Murugan Temple", false, true,
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  ),

  generateUser(
    "Valli", "Karthik", "valli.karthik@email.com", "9876543289", "user", "Female",
    new Date("1995-12-30"), "Tiruvallur", "08:50", 156, "Karkata", "Krittika", "Bharadwaja",
    "B.Sc Catering", "Chef", "410000+",
    "Chef in hotel kitchen.",
    "Chennai", "Tiruvallur", "12 Town Road", "Chennai", "Tamil Nadu", "602001",
    "Sri Vaikunda Perumal Temple", true, true,
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    "Seeking a food-loving and caring partner."
  ),

  generateUser(
    "Muthuvel", "Madasamy", "muthuvel.mada@email.com", "9876543290", "user", "Male",
    new Date("1984-04-23"), "Puzhal", "14:05", 177, "Simha", "Mrigashirsha", "Kashyapa",
    "Diploma Civil", "Construction Supervisor", "550000+",
    "Construction supervisor in real estate.",
    "Chennai", "Puzhal", "89 Lake Road", "Chennai", "Tamil Nadu", "600066",
    "Ayyanar Temple", true, true,
    "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    "Looking for a homely and understanding partner."
  ),

  generateUser(
    "Nagalakshmi", "Pandi", "nagalakshmi.pandi@email.com", "9876543291", "user", "Female",
    new Date("1990-06-07"), "Thiruvottiyur", "11:40", 164, "Kanya", "Arudra", "Vatsa",
    "MBA", "HR Executive", "670000+",
    "HR executive in manufacturing company.",
    "Chennai", "Thiruvottiyur", "34 High Road", "Chennai", "Tamil Nadu", "600019",
    "Thyagaraja Temple", true, true,
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    "Seeking a well-settled and caring partner."
  ),

  generateUser(
    "Manikandan", "Senthilnathan", "manikandan.senthil@email.com", "9876543292", "user", "Male",
    new Date("1988-09-01"), "Manali", "06:30", 175, "Tula", "Punarvasu", "Kaushika",
    "BE Mech", "Maintenance Engineer", "690000+",
    "Maintenance engineer in petrochemical plant.",
    "Chennai", "Manali", "56 Industrial Area", "Chennai", "Tamil Nadu", "600068",
    "Vadivudai Amman Temple", true, true,
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    "Looking for a caring and adjustable partner."
  ),

  generateUser(
    "Kalaiselvi", "Kumaravel", "kalaiselvi.kumar@email.com", "9876543293", "user", "Female",
    new Date("1993-11-28"), "Ennore", "09:20", 159, "Vrischika", "Pushya", "Bharadwaja",
    "B.Sc Environmental Science", "Environmental Officer", "460000+",
    "Environmental compliance officer in port.",
    "Chennai", "Ennore", "78 Port Road", "Chennai", "Tamil Nadu", "600057",
    "Ennore Murugan Temple", true, true,
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    "Seeking an environmentally conscious partner."
  ),

  generateUser(
    "Arumugam", "Pazhanisamy", "arumugam.pazhani@email.com", "9876543294", "user", "Male",
    new Date("1985-01-10"), "Kolathur", "16:25", 176, "Dhanus", "Ashlesha", "Kashyapa",
    "B.Com", "Sales Manager", "730000+",
    "Sales manager in consumer durables.",
    "Chennai", "Kolathur", "23 Perambur Road", "Chennai", "Tamil Nadu", "600099",
    "Soundararaja Perumal Temple", true, true,
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "Looking for a supportive and cheerful partner."
  ),

  generateUser(
    "Soundarya", "Karuppiah", "soundarya.karuppi@email.com", "9876543295", "user", "Female",
    new Date("1991-03-14"), "Vyasarpadi", "13:10", 163, "Makara", "Magha", "Vatsa",
    "B.Arch", "Architect", "850000+",
    "Architect in construction firm.",
    "Chennai", "Vyasarpadi", "45 Basin Bridge", "Chennai", "Tamil Nadu", "600039",
    "Angala Parameswari Temple", true, true,
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    "Seeking a creative and understanding partner."
  ),

  generateUser(
    "Boopathi", "Shanmugam", "boopathi.shanmu@email.com", "9876543296", "user", "Male",
    new Date("1989-07-06"), "Perambur", "10:05", 178, "Kumbha", "Poorva Phalguni", "Kaushika",
    "BE EEE", "Electrical Supervisor", "610000+",
    "Electrical supervisor in railway workshop.",
    "Chennai", "Perambur", "67 Loco Colony", "Chennai", "Tamil Nadu", "600011",
    "Vyasarpadi Perumal Temple", true, true,
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "Looking for a simple and family-oriented partner."
  ),

  generateUser(
    "Nirmala", "Kathiresan", "nirmala.kathir@email.com", "9876543297", "user", "Female",
    new Date("1994-05-02"), "Korukkupet", "07:45", 157, "Meena", "Uttara Phalguni", "Bharadwaja",
    "BBA", "Admin Executive", "390000+",
    "Administration executive in IT company.",
    "Chennai", "Korukkupet", "12 North Madras", "Chennai", "Tamil Nadu", "600021",
    "Mariamman Temple", true, true,
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    "Seeking a well-settled and caring partner."
  ),

  generateUser(
    "Yogesh", "Raman", "yogesh.raman@email.com", "9876543298", "user", "Male",
    new Date("1986-12-28"), "Royapuram", "15:00", 174, "Mesha", "Hasta", "Kashyapa",
    "M.Sc IT", "System Engineer", "750000+",
    "System engineer in IT infrastructure.",
    "Chennai", "Royapuram", "89 North Beach Road", "Chennai", "Tamil Nadu", "600013",
    "Kapaleeswara Temple", true, true,
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    "Looking for an educated and tech-savvy partner."
  ),

  generateUser(
    "Abinaya", "Veluchamy", "abinaya.velucha@email.com", "9876543299", "user", "Female",
    new Date("1992-08-16"), "Tondiarpet", "12:30", 160, "Rishaba", "Chitra", "Vatsa",
    "B.Sc Chemistry", "Lab Analyst", "420000+",
    "Chemical analyst in testing laboratory.",
    "Chennai", "Tondiarpet", "34 Harbor Road", "Chennai", "Tamil Nadu", "600081",
    "Kandaswamy Temple", true, true,
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    "Seeking a caring and responsible life partner."
  ),

  // 100th user - another matchmaker
  generateUser(
    "Vasuki", "Jayaraman", "matchmaker2@avs.com", "9876543300", "matchmaker", "Female",
    new Date("1982-10-10"), "Chennai", "10:00", 166, "Dhanus", "Moola", "Bharadwaja",
    "MA Psychology", "Marriage Counselor", "320000+",
    "Marriage counselor helping AVS community.",
    "Chennai", "Chennai", "100 Marriage Bureau Street", "Chennai", "Tamil Nadu", "600001",
    "Kapaleeshwarar Temple", false, true,
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
  )
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

    console.log("Database seeded successfully with 100 users!");
    console.log("\nDemo Accounts:");
    console.log("Admin: admin@avs.com / admin123");
    console.log("Matchmaker: matchmaker@avs.com / matchmaker123");
    console.log("Matchmaker 2: matchmaker2@avs.com / matchmaker123");
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
