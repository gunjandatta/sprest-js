import { Fabric, IContextualMenu, IContextualMenuProps } from "./types"
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
    props.elTarget.addEventListener("click", ev => {
        // Prevent a postback
        ev ? ev.preventDefault() : null;

        // See if the host exists and fabric class doesn't exist
        if (_menu._host && _menu._host._contextualHost.className.indexOf("fabric") < 0) {
            // Add the class
            _menu._host._contextualHost.className += " fabric";
        }
    });

    // Return the contextual menu
    return { get };
}