import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import TeamList from "../common/components/ChatWidget/ChatList/TeamList";
import renderer from "react-test-renderer";

it("renders without crashing", () => {
  const { getByTestId } = render(<TeamList />);
  const teamList = getByTestId("team-list");
  expect(teamList).toBeTruthy();
});

it("matches snapshot", () => {
  const tree = renderer.create(<TeamList />).toJSON();
  expect(tree).toMatchSnapshot();
});
