import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatContent from "../common/components/ChatWidget/ChatRoom/ChatContent";
import renderer from "react-test-renderer";

it("renders without crashing", () => {
  const { getByTestId } = render(<ChatContent />);
  const chatContent = getByTestId("chat-content");
  expect(chatContent).toBeTruthy();
});

it("matches snapshot", () => {
  const tree = renderer.create(<ChatContent />).toJSON();
  expect(tree).toMatchSnapshot();
});
