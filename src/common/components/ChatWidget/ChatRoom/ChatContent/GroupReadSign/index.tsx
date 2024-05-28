import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';

import { ActiveUser, ChatMessage } from "../../../../../../types/types";
import Person from "../../../../../images/Person.png";

// Global styles
export const useStyles = makeStyles({
  menuPopover: {
    // @ts-ignore
    position: "unset !important",
  },
  popoverPaper: {
    // marginTop: 10,
  },
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
  userItem: {
    display: 'flex',
    alignItems: 'center',
    // margin: "0.25rem",
  },
  // userList: {
  //   position: "absolute",
  //   right: 0,
  //   padding: "0.25rem",
  //   background: "#fff",
  //   boxShadow: "2px 1px 3px #00000029",
  // },
  username: {
    fontSize: 13,
    marginLeft: '0.5rem',
  },
});

interface ChatContentProps {
  groupReadPosition: any;
  message: ChatMessage;
  participants?: ActiveUser[];
}

/**
 * ChatContent component
 * @param {ChatContentProps} props Properties
 * @description ChatContent component consists of list of ChatContentItem components
 */
const One2OneReadSign: React.FC<ChatContentProps> = ({
  groupReadPosition = {},
  message,
  participants = [],
}) => {
  // Default styling
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMouseEnter = (event: any) => {
    setAnchorEl(event.currentTarget);
  }

  const handleMouseLeave = () => {
    setAnchorEl(null);
  }
  
  return (
    <div style={{ position: "relative" }}>
      <div className={classes.readUsers}>
        <div onMouseEnter={handleMouseEnter}>
          Seen by {groupReadPosition[message.id].length} user{groupReadPosition[message.id].length > 1 ? 's' : ''}
        </div>
      </div>
      <Popover
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        classes={{
          root: classes.menuPopover,
          paper: classes.popoverPaper
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onMouseLeave={handleMouseLeave}
      >
          {
            participants.filter(participant => groupReadPosition[message.id].find((id: number) => id === participant.id)).map((participant: ActiveUser) => (
              <MenuItem>
                <div className={classes.userItem}>
                  <img
                    src={participant.profilePhotoUrl}
                    height={14}
                    width={14}
                    className={classes.readUsersImage}
                    onError={(
                      e: React.SyntheticEvent<HTMLImageElement, Event>
                    ) => {
                      (e.target as HTMLImageElement).src = Person;
                    }}
                  />
                  <span className={classes.username}>{participant.firstName} {participant.lastName}</span>
                </div>
              </MenuItem>
            ))
          }
      </Popover>
    </div>
  );
};

export default One2OneReadSign;
