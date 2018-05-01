import { IListItemProps, IListProps, Fabric } from "../types";
import { ListItem } from ".";

/**
 * List
 */
export const List = (props: IListProps): string => {
    let items = props.items && props.items.length > 0 ? props.items : [];

    // See if the item is a string
    if (items.length > 0 && typeof (props.items[0]) !== "string") {
        // Parse the items
        for (let i = 0; i < items.length; i++) {
            // Update the item
            items[i] = ListItem(items[i] as IListItemProps);
        }
    }

    // Return the template
    return [
        '<ul class="ms-List ' + (props.className || "") + '">',
        items.join('\n'),
        '</ul>'
    ].join('\n');
}