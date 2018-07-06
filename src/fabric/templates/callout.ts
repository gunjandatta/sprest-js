import { ICalloutProps } from "../types";
import { CalloutTypes } from "..";
import { CommandButton } from ".";

/**
 * Callout
 */
export const Callout = (props: ICalloutProps): string => {
    // Set the class name
    let className = props.className || "";
    switch (props.type) {
        case CalloutTypes.Action:
            className += " " + "ms-Callout--actionText";
            break;

        case CalloutTypes.Close:
            className += " " + "ms-Callout--close";
            break;

        case CalloutTypes.OOBE:
            className += " " + "ms-Callout--OOBE";
            break;

        case CalloutTypes.Peek:
            className += " " + "ms-Callout--peek";
            break;

        default:
            break;
    }

    // Parse the actions
    let actions = props.actions || [];
    let actionButtons = [];
    for (let i = 0; i < actions.length; i++) {
        // Add the action button
        actionButtons.push(CommandButton(actions[i]));
    }

    // Return the template
    return [
        '<div class="ms-Callout is-hidden ' + className.trim() + '">',
        '<div class="ms-Callout-main">',
        props.showCloseButton ? '<button class="ms-Callout-close"><i class="ms-Icon ms-Icon--Clear"></i></button>' : '',
        '<div class="ms-Callout-header">',
        '<p class="ms-Callout-title">' + (props.title || "") + '</p>',
        '</div>',
        '<div class="ms-Callout-inner">',
        '<div class="ms-Callout-content">',
        (props.content || ""),
        props.subText ? '<div class="ms-Callout-subText">' + props.subText + '</div>' : '',
        '</div>',
        '<div class="ms-Callout-actions">',
        actionButtons.join('\n'),
        '</div>',
        '</div>',
        '</div>',
        '</div>'
    ].join('\n');
}