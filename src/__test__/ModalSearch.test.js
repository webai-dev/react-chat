import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModalSearch from "../common/components/ChatWidget/GroupModal/ModalSearch";
import renderer from "react-test-renderer";

it("renders without crashing", async () => {
  const { getByTestId } = render(<ModalSearch />);
  const modalSearch = getByTestId("modal-search");
  expect(modalSearch).toBeTruthy();
});

it("matches snapshot", async () => {
  const tree = renderer.create(<ModalSearch />).toJSON();
  expect(tree).toMatchSnapshot();
});
