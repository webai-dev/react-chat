import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModalHeader from "../common/components/ChatWidget/GroupModal/ModalHeader";
import renderer from "react-test-renderer";

it("renders without crashing", async () => {
  const { getByTestId } = render(<ModalHeader />);
  const modalHeader = getByTestId("modal-header");
  expect(modalHeader).toBeTruthy();
});

it("matches snapshot", async () => {
  const tree = renderer.create(<ModalHeader />).toJSON();
  expect(tree).toMatchSnapshot();
});
