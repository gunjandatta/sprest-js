import { Fabric, IList, IListItemAction, IListItemProps, IListProps } from "./types";
import { fabric, ListItem, Templates } from ".";

/**
 * List
 */
export const List = (props: IListProps): IList => {
    // Method to append list items
    let appendItems = (items: Array<string | IListItemProps> = []) => {
        // Parse the items
        for (let i = 0; i < items.length; i++) {
            // Create the item
            let item = ListItem(items[i] as IListItemProps);

            // See if the click event exists
            if (props.onClick) {
                // Add the click event
                item._container.addEventListener("click", props.onClick.bind(item._container));
            }

            // Append the list item
            _list._container.appendChild(item._container);
            _list._listItemComponents.push(item);
        }
    }

    // Method to get the fabric component
    let get = (): Fabric.IList => { return _list; }

    // Method to get the list items
    let getItems = (): Array<Fabric.IListItem> => { return _list._listItemComponents; }

    // Set the template
    props.el.innerHTML = Templates.List({
        className: props.className,
        el: props.el,
        items: []
    });

    // Create the list
    let _list: Fabric.IList = new fabric.List(props.el.querySelector(".ms-List"));

    // Append the items
    appendItems(props.items);

    // Return the list
    return {
        appendItems,
        get,
        getItems
    };
}