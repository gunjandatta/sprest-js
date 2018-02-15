import { ISpinnerProps } from "../types";

/**
 * Spinner
 */
export const Spinner = (props: ISpinnerProps): string => {
    // Return the list item
    return [
        '<div class="ms-Spinner ' + (props.className || "") + '">',
        '<div class="ms-Spinner-label">' + (props.text || "") + '</div>',
        '</div>'
    ].join('\n');
}