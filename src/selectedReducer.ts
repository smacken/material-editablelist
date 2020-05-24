export interface ListSelection<T> {
  selectedIndex: number;
  selectedText: string;
  items: T[];
}

export interface Action {
  type: string;
}

export interface SelectAction extends Action {
  index: number;
}

export interface DeleteAction extends Action {
  index: number;
}

export interface AddAction extends Action {
  index: number;
  text: string;
}

export interface EditAction extends Action {
  index: number;
  text: string;
}

export interface SelectionItem {
  text: string;
  secondary: string;
}

function isSelectAction(action: Action): action is SelectAction {
  return action.type === "select";
}

function isDeleteAction(action: Action): action is DeleteAction {
  return action.type === "delete";
}

function isAddAction(action: Action): action is AddAction {
  return action.type === "add";
}

function isEditAction(action: Action): action is EditAction {
  return action.type === "edit";
}

export function selectedReducer(state: ListSelection<SelectionItem>, action: Action): ListSelection<SelectionItem> {
  if (isSelectAction(action)) {
    state.selectedIndex = action.index;
    state.selectedText = state.items[action.index]?.text;
    return state;
  }
  if (isDeleteAction(action)) {
    state.items.splice(action.index, 1);
    state.selectedIndex = 0;
    state.selectedText = "";
    return state;
  }
  if (isAddAction(action)) {
    state.items.push({ text: action.text || "", secondary: "" });
    state.selectedIndex = 0;
    state.selectedText = "";
    return state;
  }
  if (isEditAction(action)) {
    state.items.splice(action.index, 1, { text: action.text || "", secondary: "" });
    state.selectedIndex = 0;
    state.selectedText = "";
    return state;
  }
  return state;
}
