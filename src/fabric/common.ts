import { IContextualMenuItem } from "./types";

// Method to set the click events
export const setClickEvents = (el: HTMLElement, items: Array<IContextualMenuItem>) => {
    // Ensure the element exists
    if (el == null) { return; }

    // Parse the items
    for (let i = 0; i < items.length && i < el.children.length; i++) {
        let item = items[i];

        // See if this is a menu
        if (item.menu && item.menu.length > 0) {
            // Set the click events
            setClickEvents(el.children[i].querySelector(".ms-ContextualMenu"), item.menu);
        }
        // Else, see there is a click event
        else if (item.onClick) {
            // Set the click event
            el.children[i].addEventListener("click", item.onClick);
        }
    }
}