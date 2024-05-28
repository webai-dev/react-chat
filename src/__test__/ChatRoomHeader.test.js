import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatRoomHeader from "../common/components/ChatWidget/ChatRoom/ChatRoomHeader";
import renderer from "react-test-renderer";

it("renders without crashing", () => {
  const { getByTestId } = render(<ChatRoomHeader />);
  const chatRoomHeader = getByTestId("chat-room-header");
  expect(chatRoomHeader).toBeTruthy();
});

it("matches snapshot", () => {
  let setShowModal = () => undefined;
  const tree = renderer
    .create(<ChatRoomHeader setShowModal={setShowModal} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
