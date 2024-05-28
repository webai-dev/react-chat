import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatInput from "../common/components/ChatWidget/ChatRoom/ChatInput";
import renderer from "react-test-renderer";

// react-emoji package error in test
// it("renders without crashing", () => {
//   const { getByTestId } = render(<ChatInput />);
//   const chatInput = getByTestId("chat-input");
//   expect(chatInput).toBeTruthy();
// });

it("matches snapshot", () => {
  const tree = renderer.create(<ChatInput />).toJSON();
  expect(tree).toMatchSnapshot();
});
