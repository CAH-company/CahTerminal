"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateAge } from "@/lib/validation";

interface SignUpInput {
  nickname: string;
  email: string;
  password: string;
  birthDate: string;
}

export async function signUp(input: SignUpInput) {
  const { nickname, email, password, birthDate } = input;

  if (!nickname || !email || !password || !birthDate) {
    return { error: "All fields are required." };
  }

  // Validate birth_date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return { error: "Invalid birth date format." };
  }

  // Validate password: min 8 chars, 1 uppercase, 1 number
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!/[A-Z]/.test(password)) {
    return { error: "Password must contain at least 1 uppercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { error: "Password must contain at least 1 number." };
  }

  // Validate age >= 16
  if (calculateAge(birthDate) < 16) {
    return { error: "You must be at least 16 years old to register." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
        birth_date: birthDate,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
