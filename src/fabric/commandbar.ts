import { Fabric, ICommandBar, ICommandBarProps } from "./types"
import { fabric, Templates } from ".";

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
    for (let i = 0; i < buttons.length; i++) {
        // See if a click event exists
        if (buttonProps[i].onClick && buttons[i]) {
            // Add the index attribute
            buttons[i].setAttribute("data-btn-idx", i.toString());

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
    }

    // Return the command bar
    return { get };
}
