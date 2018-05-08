import { Fabric, IDialog, IDialogProps } from "./types";
import { fabric, Templates } from ".";

/**
 * Dialog
 */
export const Dialog = (props: IDialogProps): IDialog => {
    // Returns the dialog component
    let get = (): Fabric.IDialog => { return _dialog; }

    // Return the actions container
    let getActions = (): HTMLDivElement => { return _dialog._dialog.querySelector(".ms-Dialog-actions") as HTMLDivElement; }

    // Return the actions container
    let getContent = (): HTMLDivElement => { return _dialog._dialog.querySelector(".ms-Dialog-content") as HTMLDivElement; }

    // Return the actions container
    let getTitle = (): HTMLDivElement => { return _dialog._dialog.querySelector(".ms-Dialog-title") as HTMLDivElement; }

    // Create the dialog
    props.el.innerHTML = Templates.Dialog(props);
    let _dialog: Fabric.IDialog = new fabric.Dialog(props.el.querySelector(".ms-Dialog"));

    // See if the close button exists
    if (_dialog._closeButtonElement) {
        // Add a click event
        _dialog._closeButtonElement.addEventListener("click", (ev) => {
            // Prevent postback
            ev.preventDefault();
        });
    }

    // Parse the actions
    let actions: any = getActions();
    actions = props.actions && actions ? actions.querySelectorAll("button.ms-Button") : [];
    for (let i = 0; i < actions.length && i < props.actions.length; i++) {
        let btn = actions[i] as HTMLButtonElement;

        // Set the index
        btn.setAttribute("data-idx", i.toString());

        // Set the index
        btn.addEventListener("click", ev => {
            // Prevent a postback
            ev.preventDefault();

            // Get the action
            let action = props.actions[parseInt((ev.currentTarget as HTMLElement).getAttribute("data-idx"))];
            if (action) {
                // See if this action has a click event
                if (action.onClick) {
                    // Call the click event
                    action.onClick(btn);
                }
                // Else, see if there is a link
                else if (action.href) {
                    // Redirect the window
                    window.open(action.href, "_self");
                }
            }
        });
    }

    // Return the dialog
    return {
        close: () => { _dialog.close(); },
        get,
        getActions,
        getContent,
        getTitle,
        open: () => { _dialog.open(); }
    };
}