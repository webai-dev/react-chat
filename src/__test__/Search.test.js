import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Search from "../common/components/ChatWidget/ChatList/Search";
import renderer from "react-test-renderer";

it("renders without crashing", () => {
  const { getByTestId } = render(<Search />);
  const search = getByTestId("search");
  expect(search).toBeTruthy();
});

it("matches snapshot", () => {
  const tree = renderer.create(<Search />).toJSON();
  expect(tree).toMatchSnapshot();
});
