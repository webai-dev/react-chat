import { makeStyles } from "@material-ui/styles";
import { makeStyles as makeStylesCore } from "@material-ui/core/styles";

// Global styles
export const useGlobalStyles = makeStyles(
  {
    "@global": {
      body: {
        padding: 0,
        margin: 0,
        fontFamily: "Roboto",
        backgroundColor: "#ECEFF4",
      },
    },
    root: {
      display: "flex",
      flexDirection: "column",
      width: "370px",
      height: "600px",
      position: "absolute",
      // boxShadow: '0px 3px 6px #00000029',
      bottom: 0,
      right: 0,
      margin: 0,
    },
  },
  { index: 1 }
);

export const useButtonStyles = makeStyles(
  {
    icon: {
      "&:hover": {
        cursor: "pointer",
        "& button": {
          backgroundColor: "#FCFCFC",
        },
      },
      "& button": {
        width: 56,
        height: 56,
        background: "#FCFCFC",
        borderRadius: "50%",
        color: "#3870A0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        "& svg": {
          fontSize: 40,
        },
      },
    },
    disabled: {
      opacity: 0.5,
      "& p": {
        userSelect: "none",
      },
      "&:hover": {
        cursor: "default",
        "& button": {
          cursor: "default",
        },
      },
    },
  },
  { index: 1 }
);

export const useNavbarStyle = makeStyles(
  {
    root: {
      zIndex: 10,
    },
    header: {
      color: "white",
      boxShadow: `0px 10px 10px #00000029`,
      height: 67,
      background: "#3870A0",
      position: "fixed",
      zIndex: 1000,
      top: 0,
      right: 0,
      left: 0,
    },
    toolbar: {
      zIndex: 1000,
      padding: `0px 20px`,
      margin: "0px auto",
      width: 1679,
    },
  },
  { index: 1 }
);

// Styles for Menu
export const useMenuStyle = makeStylesCore(
  (theme) => ({
    toolbar: theme.mixins.toolbar,
    sidemenu: {
      position: "fixed",
      width: 217,
      fontSize: 16,
      backgroundColor: "white",
      boxShadow: "3px 6px 10px #00000029",
      bottom: 0,
      top: 0,
      zIndex: 10,
      color: "#555555",
      paddingTop: 70,
      '& div[id="0"]': {
        padding: "8px 0px",
      },
    },
    sections: {
      color: "#555555",
      opacity: "0.7",
      fontSize: 12,
      margin: "0px 22px !important",
      display: "flex",
      paddingBottom: 20,
    },
  }),
  { index: 1 }
);

export const useWindowHeaderStyles = makeStyles(
  {
    root: {
      background: "#3870A0",
      width: "370px",
      height: "60px",
      padding: "10px 14px",
    },
    dropdownContainer: {
      background: "#3870A0",
      width: "250px",
      height: "80px",
      color: "#fff",
      padding: "0 38px",
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      margin: 0,
      top: 60,
      cursor: "pointer",
      zIndex: 1000,
    },
  },
  { index: 1 }
);

export const useHeaderFilterStyles = makeStyles(
  {
    root: {
      fontFamily: "Roboto",
      fontSize: "24px",
      fontWeight: 300,
      letterSpacing: "0px",
      color: "#FFF",
      padding: "10px 0px",
    },
    gridClass: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    },
  },
  { index: 1 }
);

export const useSearchStyles = makeStyles(
  {
    root: {
      height: "80px",
      backgroundColor: "#fff",
      paddingLeft: "30px",
      justifyContent: "start",
      alignItems: "center",
      color: "#BCBCCB",
      fontSize: "13px",
    },
    textField: {
      border: "none",
      backgroundColor: "transparent",
      color: "#4D4F5C",
      "&:focus": {
        border: "none",
        outline: "none",
      },
    },
  },
  { index: 1 }
);
