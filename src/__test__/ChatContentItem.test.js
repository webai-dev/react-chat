import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatContentItem from "../common/components/ChatWidget/ChatRoom/ChatContent/ChatContentItem";
import renderer from "react-test-renderer";

it("renders without crashing", () => {
  const { getByTestId } = render(<ChatContentItem />);
  const chatContentItem = getByTestId("chat-content-item");
  expect(chatContentItem).toBeTruthy();
});

it("matches snapshot", () => {
  let message = "",
    user = "",
    time = "",
    right = false;
  const tree = renderer
    .create(
      <ChatContentItem
        message={message}
        user={user}
        time={time}
        right={right}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
