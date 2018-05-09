import { Fabric, IContextualMenu, IContextualMenuItem, IContextualMenuProps } from "./types"
import { fabric, Templates } from ".";

/**
 * Contextual Menu
 */
export const ContextualMenu = (props: IContextualMenuProps): IContextualMenu => {
    // Method to get the contextual menu
    let get = (): Fabric.IContextualMenu => { return _menu; }

    // Method to set the click events
    let setClickEvents = (el: HTMLElement, items: Array<IContextualMenuItem>) => {
        // Ensure the element exists
        if (el == null) { return; }

        // Parse the items
        for (let i = 0; i < items.length && i < el.children.length; i++) {
            let item = items[i];

            // See if this is a menu
            if (item.menu && item.menu.length > 0) {
                // Set a click event
                el.children[i].addEventListener("click", ev => {
                    // Get the menu
                    let subMenu = _menu._host._contextualHost.nextSibling as HTMLElement;
                    if (subMenu.className.indexOf(".ms-ContextualHost") >= 0 && subMenu.className.indexOf("fabric") < 0) {
                        // Add the fabric class
                        subMenu.className += " fabric";
                    }
                });

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

    // Set the contextual menu html
    props.el.innerHTML = Templates.ContextualMenu(props);

    // Create the contextual menu
    let _menu: Fabric.IContextualMenu = new fabric.ContextualMenu(props.el.querySelector(".ms-ContextualMenu"), props.elTarget);

    // Add a click event to the target
    props.elTarget.addEventListener("click", ev => {
        // Prevent a postback
        ev ? ev.preventDefault() : null;

        // See if the host exists and fabric class doesn't exist
        if (_menu._host && _menu._host._contextualHost.className.indexOf("fabric") < 0) {
            // Add the class
            _menu._host._contextualHost.className += " fabric";

            // Set the inner html manually, to remove any events associated with this menu
            // The core framework doesn't work well w/ sub-menus.
            _menu._host._contextualHost.innerHTML = _menu._host._contextualHost.innerHTML;
        }

        // Set the click events
        setClickEvents(_menu._host._contextualHostMain.querySelector(".ms-ContextualMenu"), props.items);
    });

    // Return the contextual menu
    return { get };
}