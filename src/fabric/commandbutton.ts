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
    let btn = _button._container.querySelector(".ms-CommandButton-button") as HTMLButtonElement;
    if (btn) {
        let _html = null;

        // Set the click event
        btn.addEventListener("click", ev => {
            // Prevent postback
            ev ? ev.preventDefault() : null;

            // Ensure the fabric class name exists
            if (_button._modalHostView && _button._modalHostView._contextualHost && _button._modalHostView._contextualHost.classList.contains("fabric") == false) {
                // Add the class name
                _button._modalHostView._contextualHost.classList.add("fabric");

                // Set the inner html manually, to remove any events associated with this menu
                // The core framework doesn't work well w/ sub-menus.
                _html = _html || _button._modalHostView._contextualHost.innerHTML;
                _button._modalHostView._contextualHost.innerHTML = _html;
            }

            // See if the menu is hidden
            if (_button._contextualMenu && _button._contextualMenu.classList.contains("is-hidden")) {
                // Remove the class
                _button._contextualMenu.classList.remove("is-hidden");
            }

            // Ensure the contextual host exists
            if (_button._modalHostView && _button._modalHostView._contextualHost) {
                // Get the window and menu positions
                let windowPos = document.body.getBoundingClientRect();
                let menuPos = _button._modalHostView._contextualHost.getBoundingClientRect();

                // See if the menu is being rendered below the screen
                if (windowPos.height < menuPos.bottom) {
                    // Scroll the menu into view
                    _button._modalHostView._contextualHost.scrollIntoView(true);
                }

                // See if the menu is being rendered past the screen
                let diff = menuPos.right - windowPos.right;
                if (diff > 0) {
                    // Update the left position
                    _button._modalHostView._contextualHost.style.left = (menuPos.left - diff) + "px";
                }

                // Set the click events
                setClickEvents(_button._modalHostView._contextualHost.querySelector(".ms-ContextualMenu"), props.menu.items, (ev, item) => {
                    // Close the menu
                    _button._modalHostView.disposeModal();
                });
            }
            // Else, See if a click event exists
            else if (props.onClick) {
                // Execute the click event
                props.onClick(btn);
            }
        });
    }

    // Return the command button
    return { get };
}
