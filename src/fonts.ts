import { Crimson_Text, Fira_Code } from 'next/font/google';

/**
 * The Crimson Text font from Google Fonts
 * self-hosted by `next/font`
 *
 * @url https://fonts.google.com/specimen/Crimson+Text
 */
export const crimsonText = Crimson_Text({
  variable: '--sans-font',
  subsets: ['latin'],
  style: ['normal'],
  weight: ['400', '700'],
});

/**
 * The Fira Code font from Google Fonts
 * self-hosted by `next/font`
 *
 * @url https://fonts.google.com/specimen/Fira+Code
 */
export const firaCode = Fira_Code({
  variable: '--mono-font',
  subsets: ['latin'],
  style: ['normal'],
  weight: ['400', '600'],
});
