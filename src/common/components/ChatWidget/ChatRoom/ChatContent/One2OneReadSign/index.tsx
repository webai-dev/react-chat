import React from "react";
import { makeStyles } from "@material-ui/styles";
// import EmojiReact from "react-emoji-react";
import { Me, ChatRoom } from "../../../../../../types/types";
import Person from "../../../../../images/Person.png";

// Global styles
export const useStyles = makeStyles({
  readUsers: {
    marginTop: "5px",
    marginRight: "5px",
    width: "100%",
    height: "14px",
    display: "flex",
    justifyContent: "flex-end",
    fontSize: 13,
    cursor: 'pointer',
  },
  readUsersImage: {
    borderRadius: "50%",
    border: "1px solid #cccccc",
  },
});

interface ChatContentProps {
  chatRoom: ChatRoom | null | undefined;
  me: Me | null;
}

/**
 * ChatContent component
 * @param {ChatContentProps} props Properties
 * @description ChatContent component consists of list of ChatContentItem components
 */
const One2OneReadSign: React.FC<ChatContentProps> = ({
  chatRoom = null,
  me = null,
}) => {
  // Default styling
  const classes = useStyles();
  
  return (
    <div className={classes.readUsers}>
      <img
        src={chatRoom?.participants?.find(p => p.id !== me?.id)?.profilePhotoUrl}
        height={14}
        width={14}
        className={classes.readUsersImage}
        onError={(
          e: React.SyntheticEvent<HTMLImageElement, Event>
        ) => {
          (e.target as HTMLImageElement).src = Person;
        }}
      />
    </div>
  );
};

export default One2OneReadSign;
