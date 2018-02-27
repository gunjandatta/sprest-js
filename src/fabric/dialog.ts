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

    // Return the dialog
    return {
        get,
        getActions,
        getContent,
        getTitle
    };
}