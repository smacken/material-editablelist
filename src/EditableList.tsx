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
}

export const EditableList: React.FC<EditableListProps> = ({editList}: EditableListProps): React.ReactElement => {
    const [editItems, setEditItems] = React.useState(() => {
        if(isEditableString(editList)){
            return editList.list
                .split(editList.listSeperator)
                .map((el:string) => {
                    return {text: el}
                });
        } 
        return editList.map((el: EditableListItem) => { 
            return { text: el.text, secondary: el.secondary}
        });
    });
    const [selectedIndex, setSelectedIndex] = React.useState<number|undefined>();
    const [selectedText, setSelectedText] = React.useState<string>();
    const onItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
      ) => {
        setSelectedIndex(index);
    };
    return (
        <React.Fragment>
            <List>
                {editItems.map((value: {text: string}, index: number) => {
                    <ListItem
                        button
                        selected={selectedIndex === index}
                        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => onItemClick(event, index)}
                    >
                        {selectedIndex === index ? (
                            <>
                            <TextField label="Text" variant="outlined" value={value.text}/>
                            <ListItemSecondaryAction>
                                <Tooltip title="Add" aria-label="add device" placement="right">
                                    <IconButton onClick={() => editItems.unshift({text:''})}>
                                        <AddBoxOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete" aria-label="delete" placement="right">
                                    <IconButton edge="end" aria-label="delete">
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

                    </ListItem>
                })}
            </List>
        </React.Fragment>
    );
}