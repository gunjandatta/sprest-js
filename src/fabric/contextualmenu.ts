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

            // See if the host menu will render below the visible space
            if (document.body.clientHeight < _menu._hostTarget.getBoundingClientRect().bottom + _menu._host._contextualHost.getBoundingClientRect().height) {
                // Update the menu
                _menu._host._contextualHost.style.top = _menu._hostTarget.getBoundingClientRect().bottom + "px";
                _menu._host._contextualHost.scrollIntoView();
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