import { IButtonProps } from "../types";

/**
 * Button
 */
export const Button = (props: IButtonProps): string => {
    // Return the list item
    return [
        '<button class="ms-Button ' + (props.className || "") + '">',
        '<span class="ms-Button-label">' + (props.text || "") + '</span>',
        '</button>'
    ].join('\n');
}