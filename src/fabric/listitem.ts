import { Fabric, IListItemProps } from "./types";
import { fabric, Templates } from ".";

/**
 * List Item
 */
export const ListItem = (props: IListItemProps): Fabric.IListItem => {
    // Ensure the element exists
    props.el = props.el || document.createElement("div");

    // Set the template
    props.el.innerHTML = Templates.ListItem(props);

    // Create the list item
    let listItem = new fabric.ListItem(props.el.querySelector(".ms-ListItem")) as Fabric.IListItem;

    // See if actions exist
    if (props.actions) {
        let clickEvents: { [key: number]: (ev: MouseEvent) => void } = {};

        // Parse the actions
        for (let i = 0; i < props.actions.length; i++) {
            let action = props.actions[i];

            // See if this action has a click event
            if (action.onClick) {
                // Add this click event
                clickEvents[i] = props.actions[i].onClick;
            }
            // Else, see if the url exists
            else if (action.url) {
                // Set a click event
                clickEvents[i] = ev => {
                    let el = ev.currentTarget as HTMLDivElement;

                    // Get the target and url info
                    let target = el.getAttribute("data-target") || "_blank";
                    let url = el.getAttribute("data-url");
                    if (url) {
                        // Open the url
                        window.open(url, target);
                    }
                }
            }
        }

        // Get the actions
        let actions = props.el.querySelectorAll(".ms-ListItem-actions > .ms-ListItem-action");

        // Parse the click events
        for (let idx in clickEvents) {
            // Set the click event
            actions[idx] ? actions[idx].addEventListener("click", clickEvents[idx]) : null;
        }
    }

    // Return the list item
    return listItem;
}