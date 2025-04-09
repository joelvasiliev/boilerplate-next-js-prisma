import { DeliveryEventsSituation, UserRole } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
}

export function generateRandomPassword(form: UseFormReturn<any>) {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";
  const allCharacters = uppercase + lowercase + numbers + symbols;

  let password = "";

  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = password.length; i < 12; i++) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  password = password.split('').sort(() => 0.5 - Math.random()).join('');

  form.setValue('password', password);
  return password;
}
