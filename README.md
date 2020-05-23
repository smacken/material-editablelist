# Material Editable List

Material UI list which is editable to add/edit/delete list items.
Binds to a list or string property

## Installation

```bash
npm install --save material-editablelist
```

or

```bash
yarn add material-editablelist
```

## Getting Started

import editable list

```
import { EditableList, EditableString } from 'material-editablelist';
```

Editable list can bind to either a delimited string, or a list.

```
<EditableList editList={{list: editItem.primaryFilters, listSeperator: ':'} as EditableString}/>
```

## Examples