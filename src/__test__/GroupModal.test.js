import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import GroupModal from "../common/components/ChatWidget/GroupModal";
import EnzymeToJson from "enzyme-to-json";
import { mount } from "enzyme";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

it("renders without crashing", async () => {
  const { getByTestId } = render(<GroupModal />);
  const groupModal = getByTestId("group-modal");
  expect(groupModal).toBeTruthy();
});

it("matches snapshot", () => {
  const tree = mount(<GroupModal />);
  expect(EnzymeToJson(tree)).toMatchSnapshot();
});
