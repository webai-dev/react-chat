import React, { useState, useEffect, useContext } from "react";
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";

import ModalHeader from "./ModalHeader";
import ModalSearch from "./ModalSearch";
import ModalList from "./ModalList";
import ChatService from "../../../services/chat";
import { MeContext } from "../../../hooks/useMe";
import Alert from "@material-ui/lab/Alert";
import { CreateRoom } from "../../../../types";
import { RoomItem } from "../../../../types/types";
import { ChatRoomsContext } from "../../../hooks/useChatRooms";
import { RoomListsContext } from "../../../hooks/useRoomLists";
import { getRoomDetail } from "../../../services/rooms";

// Global styles

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export const useStyles = makeStyles({
  overlay: {
    zIndex: 100,
    position: "absolute",
    top: "0px",
    left: "0px",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.20)",
  },
  addButton: {
    width: "95px",
    height: "35px",
    marginRight: "25px",
    boxShadow: "0px 3px 6px #00000029",
    fontSize: "14px",
    backgroundColor: "#4f8dcb",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#4f8dcb",
      color: "#ffffff",
      border: "none",
      boxShadow: "0px 3px 6px #00000029",
    },
  },
  alert: {
    width: "500px",
    margin: "20px auto",
    textAlign: "center",
  },
  cancelButton: {
    width: "95px",
    height: "35px",
    marginRight: "25px",
    boxShadow: "0px 3px 6px #00000029",
    fontSize: "14px",
    color: "#4f8dcb",
    backgroundColor: "#ffffff",
    "&:hover": {
      color: "#4f8dcb",
      backgroundColor: "#ffffff",
      border: "none",
      boxShadow: "0px 3px 6px #00000029",
    },
  },
  dialogActions: {
    padding: "24px 8px !important",
  },
});

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

interface GroupModalProps {
  connectionStatus: number;
}

/**
 * GroupModal component
 * @param {GroupModalProps} props Properties
 * @description GroupModal component consists of sections - ModalHeader, ModalSearch, and ModalList
 */
const GroupModal: React.FC<GroupModalProps> = ({ connectionStatus = 1 }) => {
  // Default styling
  const classes = useStyles();
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { me } = useContext(MeContext);
  const { addChatRoom, chatRooms, updateChatRooms } =
    useContext(ChatRoomsContext);
  const { companyRoomLists, updateCompanyRoomLists } =
    useContext(RoomListsContext);
  const chatRoom = chatRooms && chatRooms.find((room) => room.groupModalOpened);

  const room =
    companyRoomLists &&
    companyRoomLists
      .map((roomList) => roomList.rooms)
      .flat()
      .find((r) => r && r.id === chatRoom?.roomId);

  useEffect(() => {
    if (chatRoom && room) {
      setName(room.name);
      setLoading(true);
      getRoomDetail(chatRoom.companyId, room.id).then((room) => {
        if (room && room.participants) {
          const participantIds = room.participants.map((p) => p.id);
          setSelectedMembers(participantIds);
        }
        setLoading(false);
      });
    }
  }, [room, chatRoom]);

  const editRoomData = async () => {
    if (room && chatRoom) {
      if (room.roomType === 0) {
        let roomMembers = (chatRoom.participants || []).map((user) => user.id);
        let participants = [
          ...selectedMembers
            .filter((id) => !roomMembers.includes(id))
            .map((id) => ({ id, action: "add" })),
          ...roomMembers
            .filter((id) => !selectedMembers.includes(id))
            .map((id) => ({ id, action: "delete" }))
        ];

        let data = {
          name,
          imageUrl: room.imageUrl || "http://46.101.170.228:3001/avatar.png",
          participants
        };
        companyRoomLists.forEach((roomList) => {
          roomList.rooms.map((r) => {
            if (r.id === room.id) {
              let newRoom = r;
              newRoom.name = name;
              return newRoom;
            } else {
              return r;
            }
          });
        });

        let { editRoom } = ChatService;
        const resp = await editRoom(chatRoom.companyId, room.id, data);
        if (resp.name) {
          chatRoom.groupModalOpened = false;
          updateChatRooms({ ...chatRoom });
        } else {
          setErrMessage(resp.errMessage);
          setError(true);
        }
      } else {
        if (me) {
          let data: CreateRoom = {
            name,
            imageUrl: room.imageUrl || "http://46.101.170.228:3001/avatar.png",
            participants: [...selectedMembers],
            roomType: 0,
          };

          let { createRoom } = ChatService;

          const resp = await createRoom(chatRoom.companyId, data);
          if (resp?.name) {
            let newRoom: RoomItem = {
              id: resp.id,
              imageUrl: resp.imageUrl,
              lastActiveUsers: [],
              lastMessage: null,
              name: resp.name,
              roomType: 0,
              unreadCount: 0,
              lastReadMessageID: null,
            };

            const roomList = companyRoomLists.find(
              (r) => r.companyId === chatRoom.companyId
            );

            if (roomList) {
              roomList.rooms = [newRoom, ...roomList.rooms];
              updateCompanyRoomLists(roomList);
            }

            addChatRoom(newRoom.id, chatRoom.companyId);
            chatRoom.groupModalOpened = false;
            updateChatRooms({ ...chatRoom });
          } else {
            setErrMessage(resp?.errMessage || '');
            setError(true);
          }
        }
      }
    }
  };

  const handleCloseModal = () => {
    if (chatRoom) {
      chatRoom.groupModalOpened = false;
      updateChatRooms({ ...chatRoom });
    }
  };

  return (
    <div data-testid="group-modal">
      <Dialog open onClose={handleCloseModal} fullWidth maxWidth="md">
        {
          loading && (
            <Box
              className={classes.overlay}
            >
              <CircularProgress />
            </Box>
          )
        }
        {error && (
          <Alert className={classes.alert} variant="filled" severity="error">
            {errMessage}
          </Alert>
        )}
        <DialogTitle id="customized-dialog-title" onClose={handleCloseModal}>
          <ModalHeader chatRoom={chatRoom} name={name} setName={setName} />
        </DialogTitle>
        <DialogContent dividers>
          <ModalSearch />
          <ModalList
            selectedMembers={selectedMembers}
            setSelectedMembers={setSelectedMembers}
            connectionStatus={connectionStatus}
          />
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            className={classes.cancelButton}
            onClick={handleCloseModal}
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            className={classes.addButton}
            onClick={editRoomData}
            variant="contained"
            disabled={!name}
          >
            { chatRoom && chatRoom.roomType === 0 ? 'Update' : 'Create' }
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GroupModal;
