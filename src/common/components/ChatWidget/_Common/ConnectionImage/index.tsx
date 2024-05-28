import React from "react";
import { makeStyles } from "@material-ui/styles";
import NullableImage from "../NullableImage";
import { ConnectionItem } from "../../../../../types/types";

// Global styles
export const useStyles = makeStyles({
  imageContainer: {
    position: "relative",
    width: 50,
    height: 50,
    minWidth: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #cccccc",
    borderRadius: 25,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  photoSingle: {
    width: 28,
    height: 28,
    borderRadius: 15,
    border: "1px solid #aaa",
    background: "white",
  },
  photoTwice: {
    width: 28,
    height: 28,
    borderRadius: 15,
    margin: "0 -5px",
    border: "1px solid #aaa",
    background: "white",
  },
  photoTriple: {
    width: 28,
    height: 28,
    borderRadius: 15,
    position: "absolute",
    border: "1px solid #aaa",
    background: "white",
  },
  photoTriple1: {
    top: 0,
    left: 10,
  },
  photoTriple2: {
    top: 18,
    left: 0,
  },
  photoTriple3: {
    top: 18,
    left: 20,
  },
  status: {
    position: "absolute",
    width: 12,
    height: 12,
    bodorRadius: 8,
    boxShadow: "0px 1px 3px #00000029",
    border: "1px solid #707070",
    borderRadius: 6,
    bottom: 0,
    right: 0,
  },
});

interface ConnectionImageProps {
  connection: ConnectionItem;
  connectionStatus: number;
}

/**
 * ConnectionImage common component
 * @param {ConnectionImageProps} props Properties
 * @description ConnectionImage component consists of conatiner for chat image
 */
const ConnectionImage: React.FC<ConnectionImageProps> = ({
  connection = {
    id: -1,
    firstName: "",
    lastName: "",
    profilePhotoUrl: "",
    isOnline: false,
  },
  connectionStatus = 1,
}) => {
  const { profilePhotoUrl, isOnline } = connection;
  const classes = useStyles();

  return (
    <div data-testid="connection-image" className={classes.imageContainer}>
      <NullableImage src={profilePhotoUrl} className={classes.photoSingle} />

      <div
        className={classes.status}
        style={{
          backgroundColor:
            connectionStatus === 1 //connection online
              ? isOnline
                ? "green"
                : "red"
              : connectionStatus === -1 //connection offline beyond reconnecting
              ? "gray"
              : "red",
        }}
      />
    </div>
  );
};

export default ConnectionImage;
