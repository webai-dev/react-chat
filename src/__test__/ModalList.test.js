import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModalList from "../common/components/ChatWidget/GroupModal/ModalList";
import renderer from "react-test-renderer";

it("renders without crashing", async () => {
  const { getByTestId } = render(<ModalList />);
  const modalList = getByTestId("modal-list");
  expect(modalList).toBeTruthy();
});

it("matches snapshot", async () => {
  let chatFilter = {
      id: null,
      name: "Connections",
    },
    addMembers = [],
    setAddMembers = () => undefined;
  const tree = renderer
    .create(
      <ModalList
        addMembers={addMembers}
        setAddMembers={setAddMembers}
        chatFilter={chatFilter}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
