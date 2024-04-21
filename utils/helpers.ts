export function isEmail(email: string): boolean {
  // Regular expression pattern for validating email addresses
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
