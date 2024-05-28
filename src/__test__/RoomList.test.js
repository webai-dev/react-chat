import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import RoomList from "../common/components/ChatWidget/ChatList/RoomList";
import renderer from "react-test-renderer";

it("renders without crashing", async () => {
  const { getByTestId } = render(<RoomList />);
  const roomList = getByTestId("room-list");
  expect(roomList).toBeTruthy();
});

it("matches snapshot", async () => {
  const tree = renderer.create(<RoomList />).toJSON();
  expect(tree).toMatchSnapshot();
});
