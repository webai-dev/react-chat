import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatListHeader from "../common/components/ChatWidget/ChatList/ChatListHeader";
import renderer from "react-test-renderer";

it("renders without crashing", async () => {
  const { getByTestId } = render(<ChatListHeader />);
  const chatListHeader = getByTestId("chat-list-header");
  expect(chatListHeader).toBeTruthy();
});

it("matches snapshot", async () => {
  const tree = renderer.create(<ChatListHeader />).toJSON();
  expect(tree).toMatchSnapshot();
});
