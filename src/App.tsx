import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { standardTheme } from "./styles/themes.alex";
import { useGlobalStyles } from "./styles/makes.alex";

import ChatWidget from "./common/components/ChatWidget";

import axios from "axios";

if (process.env.REACT_APP_ENV === "LOCAL-DEV") {
  localStorage.setItem('Token', process.env.REACT_APP_AUTHORIZATION_ID || '');
  axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.REACT_APP_AUTHORIZATION_ID}`;
} else {
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('Token')}`;
}

const App = () => {
  // Styles
  const classes = useGlobalStyles();

  return (
    <ThemeProvider theme={standardTheme}>
      <ChatWidget className={classes.root} />
    </ThemeProvider>
  );
};

export default App;
