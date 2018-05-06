import { IListItemProps, IListProps, Fabric } from "../types";
import { ListItem } from ".";

/**
 * List
 */
export const List = (props: IListProps): string => {
    let items = props.items && props.items.length > 0 ? props.items : [];
    let html = "";

    // Parse the items
    for (let i = 0; i < items.length; i++) {
        // Update the item
        html += (i == 0 ? '' : '\n') + ListItem(items[i]);
    }

    // Return the template
    return [
        '<ul class="ms-List ' + (props.className || "") + '">',
        html,
        '</ul>'
    ].join('\n');
}