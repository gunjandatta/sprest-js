import { ITextFieldProps } from "../types";
import { TextFieldTypes } from "..";

/**
 * TextField
 */
export const TextField = (props: ITextFieldProps): string => {
    let isUnderline = props.type != TextFieldTypes.Multi && props.type != TextFieldTypes.Default;

    // Set the class name
    let className = [
        props.className || "",
        props.placeholder ? "ms-TextField--placeholder" : "",
        props.type == TextFieldTypes.Multi ? "ms-TextField--multiline" : "",
        isUnderline ? "ms-TextField--underlined" : ""
    ].join(' ').trim();

    // Return the template
    return [
        '<div class="ms-TextField ' + className.trim() + '">',
        '<label class="ms-Label field-label' + (props.required ? ' is-required' : '') + '"' + (isUnderline ? ' style="display:block"' : '') + '>' + (props.label || "") + '</label>',
        props.placeholder ? '<label class="ms-Label">' + props.placeholder + '</label>' : '',
        props.type == TextFieldTypes.Multi ?
            '<textarea class="ms-TextField-field"></textarea>' :
            '<input class="ms-TextField-field" type="text" value="' + (props.value || "") + '" placeholder=""></input>',
        '<label class="ms-Label ms-fontColor-redDark error" style="color:#a80000;"></label>',
        '</div>'
    ].join('\n');
}