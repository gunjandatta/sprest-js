import { Fabric, ICommandBar, ICommandBarProps } from "./types"
import { setClickEvents } from "./common";
import { ContextualMenu, fabric, Templates } from ".";

/**
 * Command Bar
 */
export const CommandBar = (props: ICommandBarProps): ICommandBar => {
    // Method to get the command bar
    let get = (): Fabric.ICommandBar => { return _menu; }

    // Set the command bar html
    props.el.innerHTML = Templates.CommandBar(props);

    // Create the command bar
    let _menu: Fabric.ICommandBar = new fabric.CommandBar(props.el.querySelector(".ms-CommandBar"));

    // Parse the menu buttons
    let buttonProps = (props.sideCommands || []).concat(props.mainCommands || []);
    let buttons = _menu._container.querySelectorAll(".ms-CommandButton-button");
    let _html = [];
    for (let i = 0; i < buttons.length; i++) {
        // Set the html
        _html[i] = null;

        // Add the index attribute
        buttons[i].setAttribute("data-btn-idx", i.toString());

        // See if a click event exists
        if (buttonProps[i].onClick && buttons[i]) {
            // Add a click event
            buttons[i].addEventListener("click", (ev) => {
                let btn = ev.currentTarget as HTMLButtonElement;

                // Disable postback
                ev.preventDefault();

                // Get the button index
                let idx = parseInt(btn.getAttribute("data-btn-idx"));
                if (idx >= 0 && buttonProps[idx]) {
                    // Execute the postback
                    buttonProps[idx].onClick(btn);
                }
            });
        }

        // See if this is a menu
        if (buttonProps[i].menu && buttons[i]) {
            // Get the elements
            let elMenu = buttons[i].parentElement.querySelector(".ms-ContextualMenu");
            if (elMenu) {
                // Create the contextual menu
                let menu: Fabric.IContextualMenu = new fabric.ContextualMenu(elMenu, buttons[i]);

                // Set a click event
                buttons[i].addEventListener("click", ev => {
                    // See if the host exists and fabric class doesn't exist
                    if (menu._isOpen && menu._host._contextualHost.className.indexOf("fabric") < 0) {
                        // Set the class
                        menu._host._contextualHost.className += " fabric";

                        // Get the button index
                        let btn = ev.currentTarget as HTMLButtonElement;
                        let idx = parseInt(btn.getAttribute("data-btn-idx"));
                        if (idx >= 0 && buttonProps[idx] && buttonProps[idx].menu) {
                            // Set the inner html manually, to remove any events associated with this menu
                            // The core framework doesn't work well w/ sub-menus.
                            _html[idx] = _html[idx] || menu._host._contextualHost.innerHTML || "";
                            menu._host._contextualHost.innerHTML = _html[idx];

                            // Set the click events
                            setClickEvents(menu._host._contextualHost.querySelector(".ms-ContextualMenu"), buttonProps[idx].menu.items, (ev, item) => {
                                // Close the menu
                                menu._host.disposeModal();
                            });
                        }
                    }
                });
            }
        }
    }

    // Return the command bar
    return { get };
}
