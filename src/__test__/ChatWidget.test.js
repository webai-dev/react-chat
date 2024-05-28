import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatWidget from "../common/components/ChatWidget";
import renderer from "react-test-renderer";

it("renders without crashing", async () => {
  const { getByTestId } = render(<ChatWidget />);
  const chatWidget = getByTestId("chat-widget");
  expect(chatWidget).toBeTruthy();
});

it("matches snapshot", async () => {
  const tree = renderer.create(<ChatWidget />).toJSON();
  expect(tree).toMatchSnapshot();
});
