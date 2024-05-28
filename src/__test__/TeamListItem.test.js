import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import TeamListItem from "../common/components/ChatWidget/ChatList/TeamList/TeamListItem";
import renderer from "react-test-renderer";

it("renders without crashing", () => {
  const { getByTestId } = render(<TeamListItem />);
  const teamListItem = getByTestId("team-list-item");
  expect(teamListItem).toBeTruthy();
});

it("matches snapshot", () => {
  let modal = false,
    team = {
      id: 0,
      name: "",
      members: [],
    };
  const tree = renderer.create(<TeamListItem team={team} />).toJSON();
  expect(tree).toMatchSnapshot();
});
