// Run: node utils/seed.js
import { pool, connectDB } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const sampleUsers = [
  { name: 'Aarav Sharma', email: 'aarav@example.com', phone: '9000000001', gender: 'Male', age: 28,
    religion: 'Hindu', caste: 'Brahmin', mother_tongue: 'Hindi', city: 'Delhi', state: 'Delhi',
    occupation: 'Software Engineer', annual_income: 'Rs. 10 – 20 Lakh', education: 'BTech',
    height: "5' 10\"", weight: '75 kg', face_color: 'Fair', body_shape: 'Athletic',
    blood_group: 'O+', zodiac: 'Mesh (Aries)', manglik: 'No', marital_status: 'Never Married',
    hobbies: 'Cricket, Reading', about_me: 'Passionate engineer who loves to travel.',
    is_premium: true },
  { name: 'Priya Verma', email: 'priya@example.com', phone: '9000000002', gender: 'Female', age: 26,
    religion: 'Hindu', caste: 'Kayastha', mother_tongue: 'Hindi', city: 'Lucknow', state: 'Uttar Pradesh',
    occupation: 'Doctor', annual_income: 'Rs. 10 – 20 Lakh', education: 'MBBS',
    height: "5' 4\"", weight: '55 kg', face_color: 'Fair', body_shape: 'Slim',
    blood_group: 'A+', zodiac: 'Kanya (Virgo)', manglik: 'No', marital_status: 'Never Married',
    hobbies: 'Painting, Yoga', about_me: 'Doctor by profession, artist by heart.',
    is_premium: false },
  { name: 'Rohan Gupta', email: 'rohan@example.com', phone: '9000000003', gender: 'Male', age: 30,
    religion: 'Hindu', caste: 'Agarwal', mother_tongue: 'Hindi', city: 'Mumbai', state: 'Maharashtra',
    occupation: 'Business', annual_income: 'Rs. 20 Lakh & Above', education: 'MBA',
    height: "5' 11\"", weight: '78 kg', face_color: 'Wheatish', body_shape: 'Average',
    blood_group: 'B+', zodiac: 'Vrishabh (Taurus)', manglik: 'Yes', marital_status: 'Never Married',
    hobbies: 'Football, Movies', about_me: 'Entrepreneur building the future.',
    is_premium: true },
  { name: 'Ananya Iyer', email: 'ananya@example.com', phone: '9000000004', gender: 'Female', age: 25,
    religion: 'Hindu', caste: 'Brahmin', mother_tongue: 'Tamil', city: 'Chennai', state: 'Tamil Nadu',
    occupation: 'Data Scientist', annual_income: 'Rs. 10 – 20 Lakh', education: 'Postgraduate',
    height: "5' 3\"", weight: '52 kg', face_color: 'Fair', body_shape: 'Slim',
    blood_group: 'O-', zodiac: 'Mithun (Gemini)', manglik: 'No', marital_status: 'Never Married',
    hobbies: 'Classical Dance, Cooking', about_me: 'Data scientist who loves Carnatic music.',
    is_premium: false },
  { name: 'Kabir Singh', email: 'kabir@example.com', phone: '9000000005', gender: 'Male', age: 32,
    religion: 'Sikh', caste: 'Jat', mother_tongue: 'Punjabi', city: 'Chandigarh', state: 'Punjab',
    occupation: 'Architect', annual_income: 'Rs. 10 – 20 Lakh', education: 'B.Arch',
    height: "6' 0\"", weight: '85 kg', face_color: 'Wheatish', body_shape: 'Athletic',
    blood_group: 'AB+', zodiac: 'Simha (Leo)', manglik: 'No', marital_status: 'Never Married',
    hobbies: 'Cycling, Photography', about_me: 'Architect designing sustainable cities.',
    is_premium: true },
  { name: 'Riya Banerjee', email: 'riya@example.com', phone: '9000000006', gender: 'Female', age: 27,
    religion: 'Hindu', caste: 'Brahmin', mother_tongue: 'Bengali', city: 'Kolkata', state: 'West Bengal',
    occupation: 'Journalist', annual_income: 'Rs. 5 – 10 Lakh', education: 'MA',
    height: "5' 5\"", weight: '54 kg', face_color: 'Fair', body_shape: 'Slim',
    blood_group: 'A-', zodiac: 'Tula (Libra)', manglik: 'No', marital_status: 'Never Married',
    hobbies: 'Writing, Travel', about_me: 'Journalist chasing stories that matter.',
    is_premium: false },
];

const sampleStories = [
  { couple_names: 'Rahul & Priya', location: 'Mumbai', story: 'We met on First Marriage in 2023 and tied the knot within six months. Forever grateful!', married_on: '2023-11-15', image_url: '/image/s1.jpg' },
  { couple_names: 'Arjun & Sneha', location: 'Bangalore', story: 'The verified profiles gave us confidence. Today we are a happy family.', married_on: '2024-02-20', image_url: '/image/s2.jpg' },
  { couple_names: 'Vikram & Anjali', location: 'Delhi', story: 'From strangers to soulmates — thank you First Marriage!', married_on: '2024-05-10', image_url: '/image/s3.jpg' },
];

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding...');

  const password = await bcrypt.hash('Password123', 10);

  for (const u of sampleUsers) {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [u.email]);
    let userId;
    if (existing.length === 0) {
      const uuid = uuidv4();
      const [ins] = await pool.query(
        `INSERT INTO users (uuid, email, password_hash, name, phone, profile_for, gender, is_verified, is_premium, is_active)
         VALUES (?, ?, ?, ?, ?, 'Myself', ?, TRUE, ?, TRUE)`,
        [uuid, u.email, password, u.name, u.phone, u.gender, u.is_premium]
      );
      userId = ins.insertId;
      console.log(`✅ User: ${u.email} (password: Password123)`);
    } else {
      userId = existing[0].id;
      console.log(`⏭  User exists: ${u.email}`);
    }

    const [prof] = await pool.query('SELECT id FROM profiles WHERE user_id = ?', [userId]);
    if (prof.length === 0) {
      await pool.query(
        `INSERT INTO profiles (
          user_id, first_name, last_name, dob, age, religion, community, caste,
          mother_tongue, marital_status, height, weight, body_shape, face_color,
          blood_group, zodiac, manglik, country, state, city, education,
          employed_in, occupation, annual_income, hobbies, about_me,
          profile_photos, looking_for, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [
          userId,
          u.name.split(' ')[0], u.name.split(' ').slice(1).join(' '),
          new Date(new Date().setFullYear(new Date().getFullYear() - u.age)),
          u.age, u.religion, u.caste, u.caste, u.mother_tongue, u.marital_status,
          u.height, u.weight, u.body_shape, u.face_color, u.blood_group, u.zodiac,
          u.manglik, 'India', u.state, u.city, u.education, 'Private Sector',
          u.occupation, u.annual_income, u.hobbies, u.about_me,
          JSON.stringify(['/image/s1.jpg']),
          u.gender === 'Male' ? 'Woman' : 'Man',
        ]
      );
      console.log(`✅ Profile for ${u.email}`);
    }
  }

  for (const s of sampleStories) {
    const [ex] = await pool.query('SELECT id FROM success_stories WHERE couple_names = ?', [s.couple_names]);
    if (ex.length === 0) {
      await pool.query(
        `INSERT INTO success_stories (couple_names, location, story, married_on, image_url, is_published)
         VALUES (?, ?, ?, ?, ?, TRUE)`,
        [s.couple_names, s.location, s.story, s.married_on, s.image_url]
      );
      console.log(`✅ Story: ${s.couple_names}`);
    }
  }

  console.log('✅ Seed complete. Login with any seeded email and password Password123');
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });