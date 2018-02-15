import { ICalloutProps } from "../types";
import { CalloutTypes } from "..";

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
        (props.actions || ""),
        '</div>',
        '</div>',
        '</div>',
        '</div>'
    ].join('\n');
}