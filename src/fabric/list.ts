import { Fabric, IListProps } from "./types";
import { fabric, Templates } from ".";

/**
 * List
 */
export const List = (props: IListProps): Fabric.IList => {
    // Set the template
    props.el.innerHTML = Templates.List(props);

    // Return the list
    return new fabric.List(props.el.querySelector(".ms-ListItem"));
}