import { Fabric, IListItemProps } from "./types";
import { fabric, Templates } from ".";

/**
 * List Item
 */
export const ListItem = (props: IListItemProps): Fabric.IListItem => {
    // Set the template
    props.el.innerHTML = Templates.ListItem(props);

    // Return the list item
    return new fabric.ListItem(props.el.querySelector(".ms-ListItem"));
}