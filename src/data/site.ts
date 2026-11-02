// TODO: swap in the address you want public before deploying.
export const email = "jacob@proffer.dev";

export const location = {
  city: "Marquette, MI",
  coordinates: "46.54°N / 87.39°W",
};

// Career start, used to compute years of experience.
export const careerStart = new Date(2015, 8);

export const yearsOfExperience = Math.floor(
  (Date.now() - careerStart.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
);

export const sections = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

export const primaryLinks = [
  { href: "https://www.github.com/jacobproffer/", label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/jacob-proffer-a829a892/",
    label: "LinkedIn",
  },
];

export const secondaryLinks = [
  { href: "https://dribbble.com/jacobproffer/", label: "Dribbble" },
  { href: "https://monkeytype.com/profile/jproffer", label: "Monkeytype" },
  { href: "https://www.wanikani.com/users/chongo", label: "WaniKani" },
];
