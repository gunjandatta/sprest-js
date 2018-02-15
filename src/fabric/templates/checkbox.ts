import { ICheckBoxProps } from "../types";

/**
 * CheckBox
 */
export const CheckBox = (props: ICheckBoxProps): string => {
    // Return the template
    return [
        '<div class="ms-CheckBox ' + (props.className || "") + '">',
        '<input tabindex="-1" type="checkbox" class="ms-CheckBox-input"></input>',
        '<label role="checkbox" class="ms-CheckBox-field field-label' + (props.disable ? " is-disabled" : "") + '" tabindex="0" aria-checked="" name="checkbox' + props.label + '">',
        '<span class="ms-Label' + (props.required ? ' is-required' : '') + '">' + props.label + '</span>',
        '</label>',
        '</div>'
    ].join('\n');
}