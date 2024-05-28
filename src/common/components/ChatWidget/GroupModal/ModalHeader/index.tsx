import React, { useContext } from "react";
import { Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { CompanyContext } from "../../../../hooks/useCompanies";
import { ChatRoom } from '../../../../../types/types';

// Global styles
export const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: "110px",
  },
  inputBox: {
    outline: "none",
    width: "512px",
    height: "58px",
    border: "1px solid #C7C7C7",
    paddingLeft: "16px",
    paddingRight: "16px",
    fontSize: "18px",
    fontFamily: "Roboto",
    fontWeight: 300,
    "&::placeholder": {
      fontSize: "18px",
      fontFamily: "Roboto",
      fontWeight: "300",
      color: "#43425D",
    },
  },
  title: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: "24px",
    color: "#43425D",
  },
});

interface ModalHeaderProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  chatRoom?: ChatRoom;
}

/**
 * ModalHeader component
 * @description ModalHeader component consists of Title and InputBox
 */
const ModalHeader: React.FC<ModalHeaderProps> = ({
  name = '',
  setName = () => undefined,
  chatRoom = null,
}) => {
  // Default styling
  const classes = useStyles();
  const { companies } = useContext(CompanyContext);
  const company = companies.find(company => chatRoom && company.id === chatRoom.companyId);

  return (
    <>
      <Container data-testid="modal-header" className={classes.root}>
        <Typography className={classes.title}>{company && company.name}</Typography>
        <input
          value={name}
          className={classes.inputBox}
          type="text"
          placeholder="Group chat name"
          onChange={(e) => setName(e.target.value)}
        />
      </Container>
    </>
  );
};

export default ModalHeader;
