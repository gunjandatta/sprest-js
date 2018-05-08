import { Fabric, ICommandButton, ICommandButtonProps } from "./types"
import { fabric, Templates } from ".";
import { items } from "gd-sprest/build/mapper/list";

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
        // Set the click event
        btn.addEventListener("click", ev => {
            // Prevent postback
            ev ? ev.preventDefault() : null;

            // Ensure the fabric class name exists
            if (_button._modalHostView._contextualHost.className.indexOf("fabric") < 0) {
                // Add the class name
                _button._modalHostView._contextualHost.className += " fabric";
            }

            // See if the menu is hidden
            if (_button._contextualMenu.className.indexOf("is-hidden") > 0) {
                // Remove the class
                _button._contextualMenu.className = _button._contextualMenu.className.replace(/ ?is-hidden/, "");
            }

            // Ensure menu items exist
            if (props.menu && props.menu.items) {
                // Get the menu buttons
                let buttons = _button._contextualMenu.querySelectorAll(".ms-ContextualMenu-link");
                for (let i = 0; i < buttons.length && i < props.menu.items.length; i++) {
                    let button = buttons[i];
                    let item = props.menu.items[i];

                    // Dispose of the menu
                    _button._modalHostView.disposeModal();

                    // See if a click event exists
                    if (item.onClick) {
                        // Set the click event
                        button.addEventListener("click", item.onClick);
                    }
                }
            }
        });
    }

    // Return the command button
    return { get };
}
