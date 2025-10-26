import React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

import { ToastProvider } from "../components/ui";
import theme from "./theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <StyledThemeProvider theme={theme}>
      <ToastProvider>{children}</ToastProvider>
    </StyledThemeProvider>
  );
};

export default ThemeProvider;
