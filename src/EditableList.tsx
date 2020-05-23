import React from "react";
import { 
    List,
    ListItem,
    TextField,
    ListItemText,
    ListItemSecondaryAction,
    Tooltip,
    IconButton
} from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';

export interface EditableString {
    list: string;
    listSeperator: string;
}

export interface EditableListItem {
    text: string;
    secondary: string;
}

const isEditableString = (item: EditableString | EditableListItem[]): item is EditableString  => { 
    return (item as EditableString).listSeperator !== undefined;
}

export interface EditableListProps {
    editList: EditableString|EditableListItem[];
    minLength?: number;
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

function isSelectAction(action: Action): action is SelectAction {
    return action.type === 'select'
}

function isDeleteAction(action: Action): action is DeleteAction {
    return action.type === 'delete'
}

function isAddAction(action: Action): action is AddAction {
    return action.type === 'add'
}

function isEditAction(action: Action): action is EditAction {
    return action.type === 'edit'
}

interface SelectionItem {
    text: string;
    secondary: string;
}

interface ListSelection<T> {
    selectedIndex: number;
    selectedText: string;
    items: T[];
}

const initialSelection: ListSelection<SelectionItem> = {
    selectedText: '',
    selectedIndex: 0,
    items: []
};
function selectedReducer(state: ListSelection<SelectionItem>, action: Action): ListSelection<SelectionItem> {
    if (isSelectAction(action)) {
        state.selectedIndex = action.index;
        state.selectedText = state.items[action.index]?.text
        return state;
    }
    if (isDeleteAction(action)){
        state.items.splice(action.index, 1);
        state.selectedIndex = 0;
        state.selectedText = '';
        return state;
    }
    if (isAddAction(action)){
        state.items.push({text: action.text || '', secondary: ''});
        state.selectedIndex = 0;
        state.selectedText = '';
        return state;
    }
    if (isEditAction(action)){
        state.items.splice(action.index, 1, {text: action.text || '', secondary: ''});
        state.selectedIndex = 0;
        state.selectedText = '';
        return state;
    }
    return state;
}

function getEditList(editList: EditableString|EditableListItem[]) : SelectionItem[]{
    if(isEditableString(editList)){
        return editList.list ? 
            editList.list.split(editList.listSeperator)
                .map((el:string) => {
                    return {text: el, secondary: ''}
                }) : 
            [{text: '', secondary: ''}];
    } 
    return editList.map((el: EditableListItem) => { 
        return { text: el.text, secondary: el.secondary}
    });
}

export const EditableList: React.FC<EditableListProps> = ({editList, minLength}: EditableListProps): React.ReactElement => {
    initialSelection.items = getEditList(editList);
    const[selection, dispatchSelect] = React.useReducer(selectedReducer, initialSelection);
    const addInput = React.useRef<HTMLInputElement>(null);
    React.useLayoutEffect(() => {
        console.log(addInput);
    });
    const onSelect = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number): void => {
        dispatchSelect({index: index} as SelectAction);
        if (addInput.current !== null){
            addInput.current.focus();
        }
    };

    const onAdd = (event: React.MouseEvent, index: number): void => {
        event.stopPropagation();
        let text = addInput?.current?.value || ''
        if (isEditableString(editList)) {
            text = text.replace(editList.listSeperator, '');
        }
        let action = {
            index: index, 
            text: text
        };
        if (selection.items[index].text !== text){
            dispatchSelect(action as EditAction);
        }
        else {
            dispatchSelect(action as AddAction);
        }
        if (addInput.current !== null){
            addInput.current.focus();
        }
    };
    const onEnter = (event: React.KeyboardEvent<any>, index: number): void => {
        event.stopPropagation();
        if (event.key !== 'Enter') return;
        let text = addInput?.current?.value || ''
            if (isEditableString(editList)) {
                text = text.replace(editList.listSeperator, '');
            }
        let action = {
            index: index, 
            text: text
        };
        if (index === 0){
            dispatchSelect(action as AddAction);
        } else {
            dispatchSelect(action as EditAction);
        }
        if (addInput.current !== null){
            addInput.current.focus();
        }
    };

    const onDelete = (index: number) => {
        dispatchSelect({index: index} as DeleteAction);
        if (addInput.current !== null){
            addInput.current.focus();
        }
    }
    return (
        <React.Fragment>
            <List dense>
                {selection.items.map((value: {text: string}, index: number) => {
                    return (
                        <ListItem 
                            button 
                            selected={selection.selectedIndex === index}
                            key={index}
                            onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => onSelect(event, index)}
                        >
                        {selection.selectedIndex === index ? (
                            <>
                            <TextField label="Text" variant="outlined" size="small"
                                value={selection.selectedText}
                                onKeyPress={(e) => onEnter(e, index)}
                                type="text"
                                inputRef={addInput}
                            />
                            <ListItemSecondaryAction>
                                <Tooltip title="Add" aria-label="add device" placement="right">
                                    <IconButton onClick={(event) => onAdd(event, index)}>
                                        <AddBoxOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete" aria-label="delete" placement="right">
                                    <IconButton edge="end" aria-label="delete" onClick={() => onDelete(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </ListItemSecondaryAction>
                            </>
                        ): (
                            <ListItemText 
                                primary={value.text}
                            />
                        )}

                    </ListItem>);
                })}
            </List>
        </React.Fragment>
    );
}