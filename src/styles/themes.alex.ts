/**
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * Please do not modify this file!!!
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";

export const standardTheme = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        height: 25,
        width: 15,
        fontSize: 10,
        borderRadius: 0,
      },
      contained: {
        backgroundColor: "#4F8DCB",
        color: "white",
        width: "max-content",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "#4F8DCB",
          boxShadow: "none",
          border: "1px solid #0000001a",
        },
      },
      outlined: {
        backgroundColor: "#FFFFFF !important",
        width: "max-content",
        boxShadow: "none !important",
        color: "#4F8DCB !important",
        "&:hover": {
          backgroundColor: "#FFFFFF",
          boxShadow: "none",
          border: "1px solid #0000001a",
        },
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 40,
      },
    },
    MuiListItem: {
      root: {
        "&$selected": {
          borderLeft: "4px solid #555",
        },
      },
    },
    MuiBottomNavigation: {
      root: {
        backgroundColor: "transparent",
        paddingLeft: 50,
        "& button": {
          marginLeft: 1,
        },
      },
    },
    MuiBottomNavigationAction: {
      root: {
        height: 66,
        margin: "0px 25px",
        minWidth: 126,
        paddingTop: "16px !important",
        "&$selected": {
          borderBottom: "2px solid white",
        },
        "&$iconOnly": {
          paddingTop: "6px",
        },
      },
      label: {
        color: "white",
        fontSize: "16px !important",
        letterSpacing: 2,
        "&$iconOnly": {
          opacity: 0.5,
        },
      },
    },
    MuiToolbar: {
      regular: {
        minHeight: "initial !important",
      },
    },
    MuiPopover: {
      paper: {
        borderRadius: 0,
        border: "1px solid white",
        backgroundColor: "white",
        overflowX: "inherit",
        overflowY: "inherit",
        boxShadow: "1px 0px 6px 2px #00000029",
      },
    },
    MuiInputBase: {
      root: {
        alignItems: "baseline",
      },
    },
  },

  props: {
    MuiTextField: {
      size: "small",
      InputProps: {
        margin: "dense",
        style: { borderRadius: 0 },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1679,
    },
  },
});
