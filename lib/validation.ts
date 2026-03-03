/**
 * Calculate age from a birth date string in YYYY-MM-DD format.
 * Uses string parsing to avoid timezone-related date shifts.
 */
export function calculateAge(birthDateStr: string): number {
  const [year, month, day] = birthDateStr.split("-").map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() + 1 - month;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    age--;
  }
  return age;
}
