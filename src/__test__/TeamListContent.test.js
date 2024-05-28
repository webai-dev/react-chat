import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import TeamListContent from "../common/components/ChatWidget/ChatList/TeamList/TeamListContent";
import renderer from "react-test-renderer";

it("renders without crashing", async () => {
  const { getByTestId } = render(<TeamListContent />);
  const teamListContent = getByTestId("team-list-content");
  expect(teamListContent).toBeTruthy();
});

it("matches snapshot", async () => {
  const tree = renderer.create(<TeamListContent />).toJSON();
  expect(tree).toMatchSnapshot();
});
