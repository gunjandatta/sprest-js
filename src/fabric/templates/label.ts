import { ILabelProps } from "../types";

/**
 * Label
 */
export const Label = (props: ILabelProps): string => {
    // Set the class name
    let className = [
        props.className || "",
        props.isDisabled ? "is-disabled" : "",
        props.isRequired ? "is-required" : ""
    ].join(' ').trim();

    // Return the template
    return '<label class="ms-Label ' + className + ':>' + (props.text || "") + '</label>';
}