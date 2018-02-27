import { IDialogProps } from "../types";
import {Button} from ".";

/**
 * Dialog
 */
export const Dialog = (props: IDialogProps): string => {
    // Set the class name
    let className = [
        props.className || "",
        props.isBlocking ? "ms-Dialog--blocking" : "",
        props.isLargeHeader ? "ms-Dialog--lgHeader" : "",
        props.isMultiLine ? "ms-Dialog--multiline" : "",
        props.showCloseButton ? "ms-Dialog--close" : ""
    ].join(' ').trim();

    // Parse the actions
    let actions = props.actions || [];
    let dialogActions = [];
    for(let i=0; i<actions.length; i++) {
        // Add the dialog action
        dialogActions.push([
            Button({
                className: "ms-Dialog-action " + actions[i].className,
                disable: actions[i].disable,
                text: actions[i].text
            })
        ]);
    }

    // Return the template
    return [
        '<div class="ms-Dialog ' + className + '">',
        props.showCloseButton ? '<button class="ms-Dialog-button ms-Dialog-buttonClose"><i class="ms-Icon ms-Icon--Cancel"></i></button>' : '',
        '<div class="ms-Dialog-title">' + (props.title || "") + '</div>',
        '<div class="ms-Dialog-content">',
        props.subText ? '<p class="ms-Dialog-subText">' + props.subText + '</p>' : '',
        props.content || "",
        '</div>',
        actions ? '<div class="ms-Dialog-actions">' + (actions) + '</div>' : '',
        '</div>'
    ].join("");
}