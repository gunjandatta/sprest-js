import { Fabric, IListProps } from "./types";
import { fabric, Templates } from ".";

/**
 * List
 */
export const List = (props: IListProps): Fabric.IList => {
    // Set the template
    props.el.innerHTML = Templates.List(props);

    // Create the list and parse the items
    let _list: Fabric.IList = new fabric.List(props.el.querySelector(".ms-List"));

    // See if the click event is defined
    if (props.onClick && _list._listItemComponents) {
        for (let i = 0; i < _list._listItemComponents.length; i++) {
            // Add the click event
            _list._listItemComponents[i]._container.addEventListener("click", props.onClick.bind(_list._listItemComponents[i]));
        }
    }

    // Return the list
    return _list;
}