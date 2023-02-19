import {createTheme} from "@mui/material/styles";


import { ThemeOptions } from "@mui/material/styles";

export const themeOptions = {
  palette: {
    type: "light",
    primary: {
      main: "#3fb5b1",
    },
    secondary: {
      main: "#f5e900",
    },
    background: {
      default: "#2d2c2c",
      paper: "#333333",
    },
    text: {
      primary: "rgba(255,255,255,0.87)",
      secondary: "rgba(255,255,255,0.44)",
      disabled: "rgba(255,255,255,0.44)",
      hint: "rgba(255,255,255,0.44)",
    },
    divider: "rgba(195,195,195,0.12)",
  },
};

export const theme = createTheme(themeOptions);

