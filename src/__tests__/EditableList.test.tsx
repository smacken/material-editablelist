import React from "react";
import { render } from "@testing-library/react";
import { EditableListProps, EditableList } from "../EditableList";

function renderEditableList(props: Partial<EditableListProps> = {}) {
  const defaultProps: EditableListProps = {
    editList: { list: "", listSeperator: ":" },
  };
  return render(<EditableList {...defaultProps} {...props} />);
}

describe("<EditableList />", () => {
  test("should render", async () => {
    const { findByTestId } = renderEditableList();
    const editableList = await findByTestId("editablelist");
    expect(editableList).toBeTruthy();
  });
});
