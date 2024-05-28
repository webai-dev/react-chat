import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatList from "../common/components/ChatWidget/ChatList";
import renderer from "react-test-renderer";

it("renders without crashing", async () => {
  const { getByTestId } = render(<ChatList />);
  const chatList = getByTestId("chat-list");
  expect(chatList).toBeTruthy();
});

it("matches snapshot", async () => {
  const tree = renderer.create(<ChatList />).toJSON();
  expect(tree).toMatchSnapshot();
});
