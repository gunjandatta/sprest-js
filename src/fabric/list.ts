import { Fabric, IList, IListItemProps, IListProps } from "./types";
import { fabric, ListItem, Templates } from ".";

/**
 * List
 */
export const List = (props: IListProps): IList => {
    // Method to append list items
    let appendItems = (items: Array<string> = []) => {
        // Create the list
        let el = document.createElement("div");
        let list = List({ el, items }).get();

        // Parse the items
        for (let i = 0; i < list._listItemComponents.length; i++) {
            // Get the item
            let elItem = list._listItemComponents[i]._container;

            // See if the click event is defined
            if (props.onClick && _list._listItemComponents) {
                // Add the click event
                elItem.addEventListener("click", props.onClick.bind(_list._listItemComponents[i]));
            }

            // Append the list item
            _list._container.appendChild(elItem);
        }

        // Append the items
        _list._listItemComponents = _list._listItemComponents.concat(list._listItemComponents);
    }

    // Method to get the fabric component
    let get = (): Fabric.IList => { return _list; }

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
    return {
        appendItems,
        get
    };
}