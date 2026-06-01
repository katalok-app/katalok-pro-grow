export const CATEGORIES = [
  "Braids",
  "Nails",
  "Make up",
  "Hair Cut (Men)",
  "Hair Cut (Women)",
  "Wig Installation",
  "Dreadlocks",
  "Natural Hair Styling",
  "Lash Extensions",
  "Micro Blading",
  "Manicure & Pedicure",
  "Hair Maintenance",
  "Hair Extensions",
  "Massage",
  "Facials",
] as const;

export type Category = (typeof CATEGORIES)[number];
