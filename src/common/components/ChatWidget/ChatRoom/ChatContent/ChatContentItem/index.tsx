import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { Box, Grid, Container } from "@material-ui/core";
import { MeContext } from "../../../../../hooks/useMe";
import { ChatMessage, Emojis } from "../../../../../../types/types";
import { toArray } from "react-emoji-render";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import ReplyIcon from "@material-ui/icons/Reply";
import "emoji-mart/css/emoji-mart.css";
import { Picker, EmojiData, Emoji } from "emoji-mart";
import OutsideClickHandler from "react-outside-click-handler";
import CheckIcon from "@material-ui/icons/Check";
import Tooltip from "@material-ui/core/Tooltip";
import Linkify from "react-linkify";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import { v4 as uuidv4 } from "uuid";

import ChatService from "../../../../../services/chat";
import { CompanyContext } from "../../../../../hooks/useCompanies";
import { ChatRoomsContext } from "../../../../../hooks/useChatRooms";
import {NewMessage} from "../../../../../../types";
// import ChatRoom from "../..";

// import { Emoji, Emoji } from "emoji-mart/dist-es/utils/data";

// Global styles
export const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignSelf: (sent) => (sent ? "flex-end" : "flex-start"),
    width: "220px",
    padding: "5px",
    paddingBottom: 0,
    marginLeft: (sent) => (sent ? "auto" : 0),
    boxShadow: "0px 1px 3px #00000029",
    background: (sent) =>
      sent
        ? "#E0E0E8 0% 0% no-repeat padding-box"
        : "#F3F6F8 0% 0% no-repeat padding-box",
  },
  picker: {
    position: "absolute",
    right: "80px",
    bottom: "20px",
    zIndex: 3,
  },
  emojisContainer: {
    display: "flex",
    width: "30px",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "3px",
    backgroundColor: "rgba(50, 50, 50, .1)",
    borderRadius: "10px",
    cursor: "pointer",
  },
  emojisContainerMe: {
    display: "flex",
    width: "30px",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "3px",
    backgroundColor: "rgba(29, 155, 209, .2)",
    border: "1px solid rgba(29, 155, 209, .2)",
    borderRadius: "10px",
    cursor: (sent) => (sent ? "auto" : "pointer"),
  },
  emojis: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  emojisCount: {
    margin: 0,
    fontSize: "12px",
    color: "rgba(50, 50, 50, 1)",
  },
  emojisCountMe: {
    margin: 0,
    fontSize: "12px",
    color: "rgba(29, 155, 209, 1)",
  },
  failedMessage: {
    fontSize: 12,
    color: "#f00",
    textAlign: "right",
    marginTop: 5,
  },
  icon: {
    fontSize: "16px",
    color: "rgb(164, 175, 183)",
    cursor: "pointer",
    padding: "5px 5px",
  },
  retryIcon: {
    fontSize: 36,
    color: "rgb(255, 0, 0)",
    cursor: "pointer",
    paddingTop: "15px",
    height: "100%",
    marginTop: "auto",
    marginBottom: "auto",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      backgroundColor: "#eceff4",
    },
  },
  userContainer: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "5px",
    height: "21px",
    paddingBottom: "3px",
  },
  messageContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "2px",
    paddingBottom: "3px",
  },
  user: {
    fontSize: "10px",
    color: "#555555",
    fontWeight: "bold",
    letterSpacing: "0px",
    textAlign: "left",
    paddingRight: "15px",
  },
  time: {
    fontSize: "10px",
    color: "#555555",
    letterSpacing: "0px",
    textAlign: "left",
  },
  message: {
    fontSize: "12px",
    color: "#555555",
    letterSpacing: "0px",
    paddingBottom: "5px",
    textAlign: "left",
  },
  messageErrorPopup: {
    position: "absolute",
    backgroundColor: "white",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    width: "80px",
    height: "50px",
    fontSize: "14px",
    right: 0,
  },
  reactionsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: (sent) => (sent ? "flex-end" : "flex-start"),
  },
  reaction: {
    padding: "5px 3px",
  },
  checkGray: {
    fontSize: "14px !important",
    color: "#757373",
    letterSpacing: "0px",
    textAlign: "right",

    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  check: {
    fontSize: "14px !important",
    color: "#3eaf3e",
    letterSpacing: "0px",
    textAlign: "right",

    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});

interface ChatContentItemProps {
  message: ChatMessage | null;
  roomId?: number;
  companyId?: number | null;
  connectionStatus: number;
  singleReadPosition: number | undefined;
  groupAllReadPosition: number;
  groupReadPosition: any;
  roomType: number | undefined;
}

/**
 * ChatContentItem component
 * @param {ChatContentItemProps} props Properties
 * @description ChatContentItem component consists of messages UI
 */
const ChatContentItem: React.FC<ChatContentItemProps> = ({
  message = null,
  roomId = 0,
  companyId = null,
  connectionStatus = 1,
  singleReadPosition = -1,
  groupReadPosition = {},
  groupAllReadPosition = -1,
  roomType = 0,
}) => {
  // Default styling
  const { me } = useContext(MeContext);

  const classes = useStyles(me?.id === message?.user?.id);
  const { addReaction, removeReaction, reactionUser, sendMessage } =
    ChatService;
  const [emojisList, setEmojisList] = useState<Array<Emojis>>([]);
  const [emojiUsers, setEmojiUsers] = useState<Array<string>>([]);
  const [newReactions, setNewReactions] = useState<Array<string>>([]);
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const [messageCheck, setMessageCheck] = useState<string | undefined>("");
  const [isSentOnce, setIsSentOnce] = useState<boolean>(false);
  const { selectedCompany } = useContext(CompanyContext);
  const { removeFailedMessage } = useContext(ChatRoomsContext);

  const oneDayAgo = (date: string) => {
    const day = 1000 * 60 * 60 * 12;
    const daysago = Date.now() - day;

    return new Date(date).getTime() > daysago;
  };

  const getSentDate = (date: string) => {
    if (oneDayAgo(date)) {
      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return new Date(date).toLocaleString([], {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getReactionUser = async (emoji: string) => {
    setEmojiUsers([]);
    let users = await reactionUser(companyId, roomId, message?.id, emoji);
    let userName: Array<string> = [];
    users.forEach((u) => userName.push(u.firstName ? u.firstName : ""));
    setEmojiUsers(userName);
  };

  useEffect(() => {
    setMessageCheck(message?.check);
    !isSentOnce && setIsSentOnce(message?.check === "sent");
    let reactions: Array<Emojis> = [];
    if (message) {
      message?.reactions &&
        Object.entries(message?.reactions).forEach(([key, value]) => {
          let userName: Array<string> = [];

          reactions.push({
            name: key,
            count: value ? parseInt(value) : 1,
            userName: userName,
          });
        });
      setEmojisList(reactions);
    }
  }, [message, message?.reactions]);

  const onReactionClick = () => {
    setShowPicker(!showPicker);
  };

  const handleEmojiSelect = async (emoji: EmojiData) => {
    if (emojisList.some((e) => e.name === emoji.id)) {
      if (
        message?.reactions &&
        Object.entries(message?.reactions).some(
          ([key, value]) => key === emoji.id
        ) &&
        emoji.id
      ) {
        if (
          (me &&
            message?.userReactions &&
            !message.userReactions.includes(emoji.id)) ||
          (me && !message.userReactions && !newReactions.includes(emoji.id))
        ) {
          let newEmojisList = emojisList;
          let index = emojisList.findIndex((e) => e.name === emoji.id);

          let newCount = emojisList[index].count;
          newEmojisList[index] = {
            ...emojisList[index],
            count: newCount ? newCount + 1 : 1,
          };
          setEmojisList(newEmojisList);

          let reaction = { reaction: emoji.id };
          if (
            emoji.id &&
            message?.userReactions &&
            !message?.userReactions?.includes(emoji.id)
          ) {
            message?.userReactions?.push(emoji.id);
          } else if (message && emoji.id) {
            setNewReactions([...newReactions, emoji.id]);
          }
          setShowPicker(false);

          await addReaction(companyId, roomId, message?.id, reaction);
        } else {
          let newEmojisList = emojisList;
          let index = emojisList.findIndex((e) => e.name === emoji.id);
          let newCount = emojisList[index].count;
          if (newCount && newCount > 1) {
            newEmojisList[index] = {
              ...emojisList[index],
              count: newCount - 1,
            };
            setEmojisList(newEmojisList);
          } else {
            setEmojisList(emojisList.filter((e) => e.name !== emoji.id));
          }

          if (emoji.id && message.userReactions) {
            message.userReactions = message.userReactions?.filter(
              (m) => m !== emoji.id
            );
          }
          setNewReactions(newReactions.filter((r) => r !== emoji.id));

          let reaction = { reaction: emoji.id };
          await removeReaction(companyId, roomId, message?.id, reaction);
        }
      } else {
        let newEmojisList = emojisList;
        let index = emojisList.findIndex((e) => e.name === emoji.id);
        let newCount = emojisList[index].count;
        if (newCount && newCount > 1) {
          newEmojisList[index] = {
            ...emojisList[index],
            count: newCount - 1,
          };
          setEmojisList(newEmojisList);
        } else {
          setEmojisList(emojisList.filter((e) => e.name !== emoji.id));
        }
      }

      setShowPicker(false);
    } else {
      setEmojisList([
        ...emojisList,
        {
          count: 1,
          name: emoji.id ? emoji.id : "",
          userName: [me ? me?.firstName : ""],
        },
      ]);
      let reaction = { reaction: emoji.id };
      if (
        emoji.id &&
        message?.userReactions &&
        !message?.userReactions?.includes(emoji.id)
      ) {
        message?.userReactions?.push(emoji.id);
      } else if (message && emoji.id) {
        setNewReactions([...newReactions, emoji.id]);
      }

      setShowPicker(false);

      await addReaction(companyId, roomId, message?.id, reaction);
    }
  };

  const handleEmojiClick = async (emoji: Emojis) => {
    if (emojisList.some((e) => e.name === emoji.name)) {
      if (
        message?.reactions &&
        Object.entries(message?.reactions).some(
          ([key, value]) => key === emoji.name
        ) &&
        emoji.name
      ) {
        if (
          (me &&
            message?.userReactions &&
            !message.userReactions.includes(emoji.name)) ||
          (me && !message.userReactions && !newReactions.includes(emoji.name))
        ) {
          let newEmojisList = emojisList;
          let index = emojisList.findIndex((e) => e.name === emoji.name);
          let newCount = emojisList[index].count;
          newEmojisList[index] = {
            ...emojisList[index],
            count: newCount ? newCount + 1 : 1,
          };
          setEmojisList(newEmojisList);

          let reaction = { reaction: emoji.name };
          if (
            emoji.name &&
            message?.userReactions &&
            !message?.userReactions?.includes(emoji.name)
          ) {
            message?.userReactions?.push(emoji.name);
          } else if (message && emoji.name) {
            setNewReactions([...newReactions, emoji.name]);
          }
          setShowPicker(false);

          await addReaction(companyId, roomId, message?.id, reaction);
        } else {
          let newEmojisList = emojisList;
          let index = emojisList.findIndex((e) => e.name === emoji.name);
          let newCount = emojisList[index].count;
          if (newCount && newCount > 1) {
            newEmojisList[index] = {
              ...emojisList[index],
              count: newCount - 1,
            };
            setEmojisList(newEmojisList);
          } else {
            setEmojisList(emojisList.filter((e) => e.name !== emoji.name));
          }

          if (emoji.name && message.userReactions) {
            message.userReactions = message.userReactions?.filter(
              (m) => m !== emoji.name
            );
          }
          setNewReactions(newReactions.filter((r) => r !== emoji.name));

          let reaction = { reaction: emoji.name };
          await removeReaction(companyId, roomId, message?.id, reaction);
        }
      } else {
        let newEmojisList = emojisList;
        let index = emojisList.findIndex((e) => e.name === emoji.name);
        let newCount = emojisList[index].count;
        if (newCount && newCount > 1) {
          newEmojisList[index] = {
            ...emojisList[index],
            count: newCount - 1,
          };
          setEmojisList(newEmojisList);
        } else {
          setEmojisList(emojisList.filter((e) => e.name !== emoji.name));
        }
        let reaction = { reaction: emoji.name };
        await removeReaction(companyId, roomId, message?.id, reaction);
      }

      setShowPicker(false);
    }
  };

  const parseEmojis = (value: string | undefined) => {
    if (value) {
      const emojisArray = toArray(value);

      // toArray outputs React elements for emojis and strings for other
      const newValue = emojisArray.reduce((previous, current: any) => {
        if (typeof current === "string") {
          return previous + current;
        }
        return previous + current?.props?.children;
      }, "");

      return newValue;
    }
    return "";
  };

  const handleSend = async () => {
    let data = {
      message: message?.message,
      trackingID: uuidv4(),
      sentAt: new Date(),
    };

    if(message) {
      setMessageCheck("sent");
      setFailed(false);
    }

    if (connectionStatus === 1) {
      const response = await sendMessage(
          selectedCompany && selectedCompany.id,
          roomId,
          data
      );
      if (!response) {
        setMessageCheck("failed");
      }
    } else {
      let response: NewMessage | null = null;
      if (!(connectionStatus === 1)) {
        response = await sendMessage(
            selectedCompany && selectedCompany.id,
            roomId,
            data
        );

        if (response) {
          setMessageCheck("received");
          setIsSentOnce(false);
        } else {
          let started = Date.now();
          let interval = setInterval(async function () {
            if (Date.now() - started > 46000) {
              clearInterval(interval);
              setMessageCheck("failed");
              setFailed(false);
            }
            // Retry sending message for first 2 minutes or after 5 minutes
            else {
              // let response = connectionStatus === 1 ? 1 : 0;
              if (response) {
                setMessageCheck("received");
                setIsSentOnce(false);
                clearInterval(interval);
              } else {
                 response = await sendMessage(
                    selectedCompany && selectedCompany.id,
                    roomId,
                    data
                );
              }
            }
          }, 15000);
        }
      }
    }
  };

  return (
    <div
      onMouseEnter={() => {
        setShowEmojis(true);
      }}
      onMouseLeave={() => {
        setShowEmojis(false);
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Grid
          data-testid="chat-content-item"
          container
          justify="flex-end"
          className={classes.root}
        >
          <div className={classes.userContainer}>
            <div className={classes.user}>{message?.user?.firstName}</div>
            <div className={classes.time}>
              {getSentDate(message?.sentAt || "")}
            </div>
            {showEmojis && me?.id !== message?.user?.id && (
              <span
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span>
                  {" "}
                  <EmojiEmotionsIcon
                    style={{
                      fontSize: "16px",
                      color: "rgb(164, 175, 183)",
                      cursor: "pointer",
                      paddingLeft: "10px",
                    }}
                    onClick={onReactionClick}
                  />
                </span>

                <span>
                  {" "}
                  <ReplyIcon
                    style={{
                      fontSize: "16px",
                      color: "rgb(164, 175, 183)",
                      cursor: "pointer",
                      paddingLeft: "10px",
                    }}
                  />
                </span>
              </span>
            )}
          </div>
          <div className={classes.messageContainer}>
            <Linkify>
              <div className={classes.message}>
                {parseEmojis(message?.message)}
              </div>
            </Linkify>
            {
              message?.user.id === me?.id && (
                <div>
                  {(message?.check === "sent" || isSentOnce && message?.check !== "received" && messageCheck !== "received") && (
                    <CheckIcon className={classes.checkGray} />
                  )}
                  {
                    message && (
                      <React.Fragment>
                        {
                          ((roomType === 0 && message.id > groupAllReadPosition) || message?.check === "received") &&
                          <CheckIcon className={classes.check} />
                        }
                        {
                          roomType !== 0 && message.id > singleReadPosition && <CheckIcon className={classes.check} />
                        }
                      </React.Fragment>
                    )
                  }
                </div>
              )
            }
          </div>
        </Grid>
        {me?.id === message?.user?.id && messageCheck === "failed" && (
          <Box position="relative" height="100%">
            <ErrorIcon
              onClick={() => {
                setFailed(!failed);
              }}
              className={classes.retryIcon}
            />

            {failed && (
              <Container className={classes.messageErrorPopup}>
                {" "}
                <div
                  style={{
                    paddingTop: "5px",
                    marginBottom: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleSend();
                  }}
                >
                  Retry
                </div>{" "}
                <div
                  style={{ paddingTop: "5px", cursor: "pointer" }}
                  onClick={() => {
                    removeFailedMessage(roomId, message?.trackingID || "");
                  }}
                >
                  Delete
                </div>{" "}
              </Container>
            )}
          </Box>
        )}
      </div>
      {me?.id === message?.user?.id && messageCheck === "failed" && (
        <div className={classes.failedMessage}>Failed to Send</div>
      )}
      <div className={classes.reactionsContainer}>
        {emojisList.map((emoji, index) => {
          return (
            <Tooltip
              key={index}
              disableFocusListener
              title={
                emojiUsers.length > 1
                  ? `${emojiUsers.slice(0, -1).join(", ")} and ${
                      emojiUsers[emojiUsers.length - 1]
                    } reacted with :${emoji.name}:`
                  : emojiUsers.length === 1
                  ? `${emojiUsers[0]} reacted with :${emoji.name}:`
                  : ""
              }
              placement="top-start"
              onMouseEnter={() => {
                getReactionUser(emoji.name);
              }}
              arrow
            >
              <div
                className={classes.reaction}
                onClick={() => {
                  if (me && message?.user.id !== me.id) handleEmojiClick(emoji);
                }}
              >
                <div id={`${index}`}>
                  <div
                    className={
                      (message?.userReactions &&
                        message.userReactions.includes(emoji.name)) ||
                      newReactions.includes(emoji.name)
                        ? classes.emojisContainerMe
                        : classes.emojisContainer
                    }
                  >
                    {" "}
                    <Emoji emoji={emoji.name} size={16} />{" "}
                    <p
                      className={
                        (message?.userReactions &&
                          message.userReactions.includes(emoji.name)) ||
                        newReactions.includes(emoji.name)
                          ? classes.emojisCountMe
                          : classes.emojisCount
                      }
                    >
                      {emoji.count}
                    </p>
                  </div>
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>

      {showPicker && (
        <OutsideClickHandler
          onOutsideClick={() => {
            setShowPicker(false);
          }}
        >
          {" "}
          <span className={classes.picker}>
            <Picker
              perLine={5}
              showPreview={false}
              showSkinTones={false}
              onSelect={handleEmojiSelect}
              set="apple"
            />
          </span>
        </OutsideClickHandler>
      )}
    </div>
  );
};

export default ChatContentItem;
