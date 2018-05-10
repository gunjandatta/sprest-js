import { IContextualMenuItem } from "./types";

// Method to set the click events
export const setClickEvents = (el: HTMLElement, items: Array<IContextualMenuItem>) => {
    // Ensure the element exists
    if (el == null) { return; }

    // Method to fix the position of the sub-menu
    let fixMenuPos = (ev: Event) => {
        // Get the sub-menu
        let menu = (ev.currentTarget as HTMLLIElement).querySelector(".ms-ContextualMenu") as HTMLUListElement;
        if (menu) {
            let offset = 0;

            // Get the position
            let pos = menu.getBoundingClientRect();

            // See if it's visible horizontally
            offset = document.body.clientWidth - (pos.left + pos.width);
            if (offset < 0) {
                // See if the left position is set
                if (menu.style.left) {
                    let position = parseFloat(menu.style.left.replace("px", ""));

                    // Adjust the position
                    menu.style.left = (position + offset) + "px";
                } else {
                    // Adjust the position
                    menu.style.left = offset + "px";
                }
            }

            // See if it's visible vertically
            offset = document.body.clientHeight - (pos.top + pos.height);
            if (offset < 0) {
                // See if the top position is set
                if (menu.style.top) {
                    let position = parseFloat(menu.style.top.replace("px", ""));

                    // Adjust the position
                    menu.style.top = (position + offset) + "px";
                } else {
                    // Adjust the position
                    menu.style.top = offset + "px";
                }
            }
        }
    }

    // Parse the items
    for (let i = 0; i < items.length && i < el.children.length; i++) {
        let item = items[i];

        // See if this is a menu
        if (item.menu && item.menu.length > 0) {
            // Set the click events
            setClickEvents(el.children[i].querySelector(".ms-ContextualMenu"), item.menu);

            // Add the events to fix the menu position
            el.children[i].addEventListener("focus", fixMenuPos);
            el.children[i].addEventListener("mouseover", fixMenuPos);
        }
        // Else, see there is a click event
        else if (item.onClick) {
            // Set the click event
            el.children[i].addEventListener("click", item.onClick);
        }
    }
}