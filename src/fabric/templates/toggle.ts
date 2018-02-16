import { Label } from "../templates";
import { IToggleProps } from "../types";

/**
 * Toggle
 */
export const Toggle = (props: IToggleProps): string => {
    // Set the class name
    let className = props.className || "";
    if (props.disable) { className += " is-disabled"; }

    // Return the template
    return [
        props.label ? Label({ className: "field-label", text: props.label}) : '',
        '<div class="ms-Toggle ' + className.trim() + '">',
        props.description ? '<span class="ms-Toggle-description">' + props.description + "</span>" : '',
        '<input type="checkbox" class="ms-Toggle-input"></input>',
        '<label class="ms-Toggle-field' + (props.value ? ' is-selected' : '') + '" tabindex="0">',
        '<span class="ms-Label ms-Label--off">Off</span>',
        '<span class="ms-Label ms-Label--on">On</span>',
        '</label>',
        '</div>'
    ].join('\n');
}