export const defaultTheme = {
  colors: {
    background: {
      primary: "#121212",
      secondary: "#FFFFFF",
    },
    text: {
      primary: "#FFFFFF",
      primaryDarker: "#686D76",
      secondary: "#121212",
    },
    border: {
      primary: "#686D76",
    },
    icon: {
      primary: "#FFFFFF",
      secondary: "#121212",
      secondaryLighter: "#686D76",
    },
  },
  spacing: {
    xxxs: 4,
    xxs: 8,
    xs: 12,
    sml: 16,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 56,
  },
  fontSizes: {
    xs: 12,
    sml: 16,
    md: 24,
    lg: 32,
    xl: 40,
  },
} as const;

export type Theme = typeof defaultTheme;
