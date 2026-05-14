/**
 * Static translations for the portfolio site
 */

export const translations = {
  en: {
    // Navigation
    skipToContent: "Skip to main content",

    // Home page
    heroDescription:
      "I'm a front-end developer based in Marquette, Michigan with ten years of agency experience. I specialize in crafting accessible and performant solutions for the web.",

    // Sections
    projects: "Personal Projects",
    experience: "Experience",
    education: "Education",

    // Education
    universityName: "Northern Michigan University",
    degree: "Bachelor of Fine Arts in Computer Art",

    // 404
    notFoundTitle: "404 - Page Not Found",
    notFoundMessage: "The page you're looking for doesn't exist.",
    backToHome: "Back to Home",

    // Date formatting
    present: "Present",
  },
  ja: {
    // Navigation
    skipToContent: "メインコンテンツへスキップ",

    // Home page
    heroDescription:
      "私はミシガン州マーケットに拠点を置くフロントエンド開発者で、10年間の代理店経験があります。アクセシブルで高性能なウェブソリューションの作成を専門としています。",

    // Sections
    projects: "個人プロジェクト",
    experience: "職務経歴",
    education: "学歴",

    // Education
    universityName: "ノーザンミシガン大学",
    degree: "コンピューターアート学士号",

    // 404
    notFoundTitle: "404 - ページが見つかりません",
    notFoundMessage: "お探しのページが見つかりませんでした。",
    backToHome: "ホームに戻る",

    // Date formatting
    present: "現在",
  },
} as const;

export type Locale = keyof typeof translations;

export function t(locale: string, key: string): string {
  const validLocale = (locale === "ja" ? "ja" : "en") as Locale;
  const keys = key.split(".");
  let value: any = translations[validLocale];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}
