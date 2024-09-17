export const defaultTheme = {
  colors: {
    background: {
      primary: "#434343",
    },
    text: {
      primary: "#FFFFFF",
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
};

export type Theme = typeof defaultTheme;
