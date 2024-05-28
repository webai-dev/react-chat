import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatRoom from "../common/components/ChatWidget/ChatRoom";
import renderer from "react-test-renderer";

// react-emoji package error in test
// it("renders without crashing", () => {
//   const { getByTestId } = render(<ChatRoom />);
//   const chatWidget = getByTestId("chat-room");
//   expect(chatWidget).toBeTruthy();
// });

it("matches snapshot", () => {
  let index = 1,
    roomId = 1,
    setShowModal = () => undefined;
  const tree = renderer
    .create(
      <ChatRoom index={index} roomId={roomId} setShowModal={setShowModal} />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
