/** Warm microcopy. Short, gentle, never pressuring. */

export const ENCOURAGEMENTS = [
  "You've got this, sunshine! ☀️",
  "One question at a time, pretty girl. 💗",
  "Little steps count, too. 🌷",
  "Take a breath. You're doing better than you think.",
  "Your effort matters more than one score.",
  "Proud of you for showing up today. 💕",
  "Ready for another little victory?",
  "A short break is okay. Come back when you're ready.",
  "Slow and steady still gets there. 🌸",
  "You don't have to know it all today. Just a little more than yesterday.",
];

export const CORRECT_MESSAGES = [
  "Yay! You got it right! 🌸 You're doing amazing. Keep going!",
  "Beautiful! That's exactly right. 💗",
  "Look at you! Another one in the bag. ✨",
  "Yes! Your hard work is showing. 🌷",
];

export const INCORRECT_MESSAGES = [
  "That's okay, sweetheart. 💗 Every mistake is a chance to learn. Take a look at the correct answer, and you'll be more prepared next time.",
  "Not this time, and that's completely fine. 🌷 Have a gentle look at the answer below — it'll stick better now.",
  "It's okay. 💕 This is exactly what practice is for. You'll remember this one.",
];

export function pick<T>(list: readonly T[], seed: number): T {
  return list[Math.abs(Math.floor(seed)) % list.length];
}

export function resultMessage(pct: number | null, previousPct: number | null): string {
  if (pct === null) return "You didn't answer any questions this time — that's completely okay. Come back whenever you're ready. 💗";
  if (pct >= 0.85) return "Look at you go! 🌷 Your hard work is paying off.";
  if (previousPct !== null && pct > previousPct + 0.001) {
    return "You're getting stronger with every attempt. Keep believing in yourself! 🌸";
  }
  if (pct >= 0.5) return "Nice, steady work. 💕 Every question you try makes the next one a little easier.";
  return "It's okay. This is practice, not a judgment. Let's learn from these questions together. 💗";
}

export function greeting(hour: number): string {
  if (hour < 5) return "Hey, night owl! 🌙";
  if (hour < 12) return "Good morning, sunshine! 🌷";
  if (hour < 18) return "Hey, sunshine! 🌷";
  return "Good evening, lovely! 🌸";
}
