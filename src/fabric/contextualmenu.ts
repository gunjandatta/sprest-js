import { Fabric, IContextualMenu, IContextualMenuProps } from "./types"
import { IContextualHost } from "./types/fabric";
import { setClickEvents } from "./common";
import { fabric, Templates } from ".";

/**
 * Contextual Menu
 */
export const ContextualMenu = (props: IContextualMenuProps): IContextualMenu => {
    // Method to get the contextual menu
    let get = (): Fabric.IContextualMenu => { return _menu; }

    // Set the contextual menu html
    props.el.innerHTML = Templates.ContextualMenu(props);

    // Create the contextual menu
    let _menu: Fabric.IContextualMenu = new fabric.ContextualMenu(props.el.querySelector(".ms-ContextualMenu"), props.elTarget);

    // Determine if this menu has sub-menus
    let hasSubMenu = false;
    for (let i = 0; i < props.items.length; i++) {
        // See if a sub-menu exists
        if (props.items[i].menu) {
            // Set the flag
            hasSubMenu = true;
            break;
        }
    }

    // Add a click event to the target
    let _html = null;
    props.elTarget.addEventListener("click", ev => {
        // Prevent a postback
        ev ? ev.preventDefault() : null;

        // See if the host exists and fabric class doesn't exist
        if (_menu._host && _menu._host._contextualHost.className.indexOf("fabric") < 0) {
            // Add the class
            _menu._host._contextualHost.className += " fabric";

            // Set the inner html manually, to remove any events associated with this menu
            // The core framework doesn't work well w/ sub-menus.
            _html = _html || _menu._host._contextualHost.innerHTML;
            _menu._host._contextualHost.innerHTML = _html;

            // See if the menu is not positioned
            if (_menu._host._contextualHost.className.indexOf("is-positioned") < 0) {
                // Clear the styling and ensure it's positioned
                _menu._host._contextualHost.removeAttribute("style");
                _menu._host._contextualHost.className += " is-positioned";
            }

            // Ensure the menu is being rendered under the target
            _menu._host._contextualHost.style.left = _menu._hostTarget.getBoundingClientRect().left + "px";
            _menu._host._contextualHost.style.top = _menu._hostTarget.getBoundingClientRect().bottom + "px";

            // See if a sub-menu doesn't exists
            if (!hasSubMenu) {
                // Set the max height and scroll
                _menu._host._contextualHost.style.maxHeight = "300px";
                _menu._host._contextualHost.style.overflowY = "auto";
            }

            // See if the menu is being rendered below the screen
            if (document.body.getBoundingClientRect().height < _menu._host._contextualHost.getBoundingClientRect().bottom) {
                // Scroll the menu into view
                _menu._host._contextualHost.scrollIntoView(true);
            }
        }

        // Set the click events
        setClickEvents(_menu._host._contextualHost.querySelector(".ms-ContextualMenu"), props.items, (ev, item) => {
            // See if a click event exists
            if (props.onClick) {
                // Call the click event
                props.onClick(ev, item);
            } else {
                // Close the menu by default
                _menu._host.disposeModal();
            }
        });
    });

    // Return the contextual menu
    return {
        // Closes the menu
        close: () => {
            // See if the host exists
            if (_menu._host) {
                // Close the menu
                _menu._host.disposeModal();
            }
        },
        get
    };
}