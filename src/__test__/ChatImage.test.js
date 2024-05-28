import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatImage from "../common/components/ChatWidget/_Common/ChatImage";
import renderer from "react-test-renderer";

it("renders without crashing", () => {
  const { getByTestId } = render(<ChatImage />);
  const chatImage = getByTestId("chat-image");
  expect(chatImage).toBeTruthy();
});

it("matches snapshot", () => {
  const tree = renderer.create(<ChatImage />).toJSON();
  expect(tree).toMatchSnapshot();
});
