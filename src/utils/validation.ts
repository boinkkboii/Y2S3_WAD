export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const regex = /^\d{10,15}$/; // Accepts 10 to 15 digit numbers
  return regex.test(phone.trim());
};

export const isValidDOB = (dob: string): boolean => {
  // Expect format YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dob)) return false;

  const date = new Date(dob);
  const today = new Date();
  return !isNaN(date.getTime()) && date < today;
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, maximum 50 characters
  const regex = /^.{8,50}$/;
  return regex.test(password);
};
