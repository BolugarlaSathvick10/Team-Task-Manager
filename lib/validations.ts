export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function validateProjectTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 255;
}

export function validateTaskTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 255;
}

export function validateUserName(name: string): boolean {
  return name.trim().length > 0 && name.length <= 255;
}
