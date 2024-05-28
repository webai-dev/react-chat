import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import RoomListItem from "../common/components/ChatWidget/ChatList/RoomList/RoomListItem";
import renderer from "react-test-renderer";

it("renders without crashing", async () => {
  const { getByTestId } = await render(<RoomListItem />);
  const roomListItem = await getByTestId("room-list-item");
  expect(roomListItem).toBeTruthy();
});

it("matches snapshot", async () => {
  let onClick = () => undefined,
    team = false,
    modal = false,
    selectedRoomId = -1,
    room = {
      id: 0,
      lastActiveUsers: [],
      lastReadMessageID: 0,
      name: "",
      roomType: 0,
      unreadCount: 0,
    };
  const tree = renderer
    .create(
      <RoomListItem
        room={room}
        selectedRoomId={selectedRoomId}
        onClick={onClick}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
