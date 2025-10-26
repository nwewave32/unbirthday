import unbirthdayTheme from "../assets/theme.json";

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    black: string;
    white: string;
    grey: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };

    red: string;
    blue: string;
    success: string;
    warning: string;
    error: string;
    background: {
      primary: string;
      secondary: string;
      hover: string;
      disabled: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      inverse: string;
    };
    border: {
      primary: string;
      secondary: string;
      active: string;
    };
  };
  typography: {
    fontFamily: {
      base: string;
      display: string;
    };
    fontSize: {
      xs: string;
      s: string;
      m: string;
      l: string;
      xl: string;
      xxl: string;
      xxxl: string;
    };
    fontWeight: {
      regular: number;
      medium: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    s: string;
    m: string;
    l: string;
    xl: string;
    xxl: string;
    xxxl: string;
    xxxxl: string;
  };
  borderRadius: {
    s: string;
    m: string;
    l: string;
    xl: string;
    round: string;
  };
  shadows: {
    default: string;
    inverse: string;
  };
  transitions: {
    fast: string;
    normal: string;
  };
  breakpoints: {
    xs: string;
    s: string;
    m: string;
    l: string;
    xl: string;
  };
}

const cssVars = unbirthdayTheme.colors.cssVariables;

export const theme: Theme = {
  colors: {
    primary: cssVars["--podium-cds-color-black"],
    secondary: cssVars["--podium-cds-color-grey-100"],
    black: cssVars["--podium-cds-color-black"],
    white: cssVars["--podium-cds-color-white"],
    grey: {
      50: cssVars["--podium-cds-color-grey-50"],
      100: cssVars["--podium-cds-color-grey-100"],
      200: cssVars["--podium-cds-color-grey-200"],
      300: cssVars["--podium-cds-color-grey-300"],
      400: cssVars["--podium-cds-color-grey-400"],
      500: cssVars["--podium-cds-color-grey-500"],
      600: cssVars["--podium-cds-color-grey-600"],
      700: cssVars["--podium-cds-color-grey-700"],
      800: cssVars["--podium-cds-color-grey-800"],
      900: cssVars["--podium-cds-color-grey-900"],
    },

    red: cssVars["--podium-cds-color-brand-snkrs-red"],
    blue: cssVars["--podium-cds-color-info"],
    success: cssVars["--podium-cds-color-success"],
    warning: cssVars["--podium-cds-color-warning"],
    error: cssVars["--podium-cds-color-critical"],
    background: {
      primary: cssVars["--podium-cds-color-bg-primary"],
      secondary: cssVars["--podium-cds-color-bg-secondary"],
      hover: cssVars["--podium-cds-color-bg-hover"],
      disabled: cssVars["--podium-cds-color-bg-disabled"],
    },
    text: {
      primary: cssVars["--podium-cds-color-text-primary"],
      secondary: cssVars["--podium-cds-color-text-secondary"],
      disabled: cssVars["--podium-cds-color-text-disabled"],
      inverse: cssVars["--podium-cds-color-text-primary-inverse"],
    },
    border: {
      primary: cssVars["--podium-cds-color-border-primary"],
      secondary: cssVars["--podium-cds-color-border-secondary"],
      active: cssVars["--podium-cds-color-border-active"],
    },
  },
  typography: {
    fontFamily: {
      base: '"Helvetica Now Text", Helvetica, Arial, sans-serif',
      display: '"Helvetica Now Display Medium", Helvetica, Arial, sans-serif',
    },
    fontSize: {
      xs: cssVars["--podium-cds-font-size-xs"],
      s: cssVars["--podium-cds-font-size-s"],
      m: cssVars["--podium-cds-font-size-m"],
      l: cssVars["--podium-cds-font-size-l"],
      xl: cssVars["--podium-cds-font-size-xl"],
      xxl: cssVars["--podium-cds-font-size-xxl"],
      xxxl: cssVars["--podium-cds-font-size-xxxl"],
    },
    fontWeight: {
      regular: parseInt(cssVars["--podium-cds-font-weight-regular"]),
      medium: parseInt(cssVars["--podium-cds-font-weight-medium"]),
      bold: parseInt(cssVars["--podium-cds-font-weight-bold"]),
    },
  },
  spacing: {
    xs: cssVars["--podium-cds-size-spacing-xs"],
    s: cssVars["--podium-cds-size-spacing-s"],
    m: cssVars["--podium-cds-size-spacing-m"],
    l: cssVars["--podium-cds-size-spacing-l"],
    xl: cssVars["--podium-cds-size-spacing-xl"],
    xxl: cssVars["--podium-cds-size-spacing-xxl"],
    xxxl: cssVars["--podium-cds-size-spacing-xxxl"],
    xxxxl: cssVars["--podium-cds-size-spacing-xxxxl"],
  },
  borderRadius: {
    s: cssVars["--podium-cds-size-border-radius-s"],
    m: cssVars["--podium-cds-size-border-radius-m"],
    l: cssVars["--podium-cds-size-border-radius-l"],
    xl: cssVars["--podium-cds-size-border-radius-xl"],
    round: cssVars["--podium-cds-button-border-radius"],
  },
  shadows: {
    default: cssVars["--podium-cds-shadow-100"],
    inverse: cssVars["--podium-cds-shadow-100-inverse"],
  },
  transitions: {
    fast: cssVars["--podium-cds-transition-duration-fast"],
    normal: cssVars["--podium-cds-transition-duration-normal"],
  },
  breakpoints: {
    xs: cssVars["--podium-cds-breakpoint-xs"],
    s: cssVars["--podium-cds-breakpoint-s"],
    m: cssVars["--podium-cds-breakpoint-m"],
    l: cssVars["--podium-cds-breakpoint-l"],
    xl: cssVars["--podium-cds-breakpoint-xl"],
  },
};

export default theme;
