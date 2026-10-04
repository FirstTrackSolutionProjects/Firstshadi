import { pool } from '../config/database.js';

// Send email OTP
export const sendEmailOTP = async (email, otp) => {
  try {
    console.log(`📧 Email OTP sent to ${email}: ${otp}`);
    
    // For production, use nodemailer
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS
    //   }
    // });
    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: 'Your OTP for First Marriage',
    //   html: `<h2>Your OTP is: ${otp}</h2><p>This OTP expires in 10 minutes.</p>`
    // });
    
    return true;
  } catch (error) {
    console.error('Email OTP error:', error);
    // Don't throw error, just log it
    return false;
  }
};

// Send phone OTP (via SMS)
export const sendPhoneOTP = async (phone, otp) => {
  try {
    console.log(`📱 Phone OTP sent to ${phone}: ${otp}`);
    
    // For production, use Twilio or any SMS service
    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;
    // const client = require('twilio')(accountSid, authToken);
    // await client.messages.create({
    //   body: `Your OTP for First Marriage is: ${otp}. Valid for 10 minutes.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone
    // });
    
    return true;
  } catch (error) {
    console.error('Phone OTP error:', error);
    // Don't throw error, just log it
    return false;
  }
};

// Verify OTP
export const verifyOTP = async (email, phone, otp, type) => {
  try {
    let query = 'SELECT * FROM otps WHERE otp = ? AND type = ? AND is_used = FALSE AND expires_at > NOW()';
    const params = [otp, type];

    if (email) {
      query += ' AND email = ?';
      params.push(email);
    } else if (phone) {
      query += ' AND phone = ?';
      params.push(phone);
    }

    const [rows] = await pool.query(query, params);
    return rows.length > 0;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return false;
  }
};

// Calculate age from DOB
export const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Format currency
export const formatCurrency = (amount, currency = '₹') => {
  return `${currency} ${Number(amount).toLocaleString('en-IN')}`;
};

// Validate phone number
export const isValidPhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

// Validate email
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};