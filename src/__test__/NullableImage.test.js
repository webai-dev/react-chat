import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Nullable from "../common/components/ChatWidget/_Common/NullableImage";
import renderer from "react-test-renderer";

it("renders without crashing", () => {
  const { getByTestId } = render(<Nullable />);
  const nullable = getByTestId("nullable-image");
  expect(nullable).toBeTruthy();
});

it("matches snapshot", () => {
  const tree = renderer.create(<Nullable />).toJSON();
  expect(tree).toMatchSnapshot();
});
