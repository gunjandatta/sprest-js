import { Fabric, ICommandButton, ICommandButtonProps } from "./types"
import { setClickEvents } from "./common";
import { fabric, Templates } from ".";

/**
 * Command Button
 */
export const CommandButton = (props: ICommandButtonProps): ICommandButton => {
    // Method to get the fabric component
    let get = (): Fabric.ICommandButton => { return _button; }

    // Set the command button html
    props.el.innerHTML = Templates.CommandButton(props);

    // Create the command button
    let _button: Fabric.ICommandButton = new fabric.CommandButton(props.el.querySelector(".ms-CommandButton"));

    // Parse the menu button
    let btn = _button._container.querySelector(".ms-CommandButton-button");
    if (btn) {
        let _html = null;

        // Set the click event
        btn.addEventListener("click", ev => {
            // Prevent postback
            ev ? ev.preventDefault() : null;

            // Ensure the fabric class name exists
            if (_button._modalHostView._contextualHost.classList.contains("fabric") == false) {
                // Add the class name
                _button._modalHostView._contextualHost.classList.add("fabric");

                // Set the inner html manually, to remove any events associated with this menu
                // The core framework doesn't work well w/ sub-menus.
                _html = _html || _button._modalHostView._contextualHost.innerHTML;
                _button._modalHostView._contextualHost.innerHTML = _html;
            }

            // See if the menu is hidden
            if (_button._contextualMenu.classList.contains("is-hidden")) {
                // Remove the class
                _button._contextualMenu.classList.remove("is-hidden");
            }

            // Set the click events
            setClickEvents(_button._modalHostView._contextualHost.querySelector(".ms-ContextualMenu"), props.menu.items, (ev, item) => {
                // Close the menu
                _button._modalHostView.disposeModal();
            });
        });
    }

    // Return the command button
    return { get };
}
