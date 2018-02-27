import { Fabric, IDialogProps } from "./types";
import { fabric, Templates } from ".";

/**
 * Dialog
 */
export const Dialog = (props: IDialogProps):Fabric.IDialog => {
    // Create the dialog
    props.el.innerHTML = Templates.Dialog(props);
    let _dialog: Fabric.IDialog = new fabric.Dialog(props.el.querySelector(".ms-Dialog"));

    // Return the dialog
    return _dialog;
}