// Validation functions
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

export const validatePassword = (password) => {
  // At least 8 characters, at least one letter and one number
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return regex.test(password);
};

export const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
};

export const validateDOB = (dob) => {
  const date = new Date(dob);
  return !isNaN(date.getTime()) && date < new Date();
};

export const validateProfileData = (data) => {
  const errors = [];

  if (data.first_name && !validateName(data.first_name)) {
    errors.push('First name must be between 2 and 100 characters');
  }

  if (data.last_name && data.last_name.trim() && !validateName(data.last_name)) {
    errors.push('Last name must be between 2 and 100 characters');
  }

  if (data.dob && !validateDOB(data.dob)) {
    errors.push('Invalid date of birth');
  }

  return errors;
};

export const validatePlan = (plan) => {
  const validPlans = ['7days', '15days', '30days', '3months', '5months', '1year'];
  return validPlans.includes(plan);
};

export const validatePaymentMethod = (method) => {
  const validMethods = ['credit', 'debit', 'paypal', 'upi'];
  return validMethods.includes(method);
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
  validateDOB,
  validateProfileData,
  validatePlan,
  validatePaymentMethod
};