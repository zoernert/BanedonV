export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 6) {
    feedback.push('Password must be at least 6 characters long');
  } else if (password.length < 8) {
    feedback.push('Password should be at least 8 characters long');
    score += 1;
  } else {
    score += 2;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('Password should contain lowercase letters');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Password should contain uppercase letters');
  } else {
    score += 1;
  }

  if (!/[0-9]/.test(password)) {
    feedback.push('Password should contain numbers');
  } else {
    score += 1;
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push('Password should contain special characters');
  } else {
    score += 1;
  }

  return {
    isValid: score >= 3,
    score,
    feedback
  };
}
