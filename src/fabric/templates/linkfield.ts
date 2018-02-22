import { ILinkFieldProps } from "../types";
import { Label } from ".";

/**
 * Link Field
 */
export const LinkField = (props: ILinkFieldProps): string => {
    let desc = (props.value ? props.value.Description : null) || "";
    let url = (props.value ? props.value.Url : null) || "";

    // Return the template
    return [
        '<div class="ms-LinkField ' + (props.className || "") + '">',
        props.label ? Label({
            className: "field-label",
            description: props.description,
            isRequired: props.required,
            text: props.label
        }) : '',
        '<a class="ms-Link" href="' + url + '">' + (desc || url) + '</a>',
        '</div>'
    ].join("");
}