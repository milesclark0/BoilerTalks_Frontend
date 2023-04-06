import { createTheme } from "@mui/material/styles";

import { ThemeOptions } from "@mui/material/styles";

export const dark: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#141414",
    },
    secondary: {
      main: "#bdccf3d5",
    },
    background: {
      default: "#2d2c2c",
      paper: "#333333",
    },
    text: {
      primary: "#fdfafadd",
      secondary: "#80808070",
      disabled: "#ffffff70",
    },
    divider: "#c3c3c31e",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "0px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#fdfafadd",
        },
      },
    },
  },
};

export const light: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#bebebefc",
    },
    secondary: {
      main: "#81a4fcd6",
    },
    background: {
      default: "#2d2c2c",
      paper: "#f3f3f3",
    },
    text: {
      primary: "#161616dd",
      secondary: "#16161670",
      disabled: "#16161670",
    },
    divider: "#c3c3c31e",
  },
    components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "0px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#161616dd",
        },
      },
    },
  },
};

export const darkTheme = createTheme(dark);

export const lightTheme = createTheme(light);
