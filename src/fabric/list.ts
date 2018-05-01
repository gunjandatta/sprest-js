import { Fabric, IList, IListItemAction, IListItemProps, IListProps } from "./types";
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

    // Method to get the list items
    let getItems = (): Array<Fabric.IListItem> => { return _list._listItemComponents; }

    // Set the template
    props.el.innerHTML = Templates.List(props);

    // Create the list
    let _list: Fabric.IList = new fabric.List(props.el.querySelector(".ms-List"));

    // See if the click event is defined
    if (props.onClick && _list._listItemComponents) {
        // Parse the list items
        for (let i = 0; i < _list._listItemComponents.length; i++) {
            let item = _list._listItemComponents[i];
            let itemProps = props.items[i] as IListItemProps;

            // Add the click event
            item._container.addEventListener("click", props.onClick.bind(_list._listItemComponents[i]));

            // See if actions exist for this item
            if (itemProps && itemProps.actions) {
                let icons = item._container.querySelectorAll(".ms-ListItem-action");

                // Parse the actions
                for (let j = 0; j < itemProps.actions.length; j++) {
                    let action = itemProps.actions[j];

                    // Ensure the icon exists
                    if (icons[j]) {
                        // See if the click event exists
                        if (action.onClick) {
                            // Set the click event
                            icons[j].addEventListener("click", action.onClick);
                        }
                        // Else, see if the url exists
                        else if (action.url) {
                            // Set the click event
                            icons[j].addEventListener("click", ev => {
                                let el = ev.currentTarget as HTMLDivElement;

                                // Get the target and url info
                                let target = el.getAttribute("data-target") || "_blank";
                                let url = el.getAttribute("data-url");
                                if (url) {
                                    // Open the url
                                    window.open(url, target);
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    // Return the list
    return {
        appendItems,
        get,
        getItems
    };
}