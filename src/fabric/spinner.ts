import { fabric } from ".";
import { ISpinner, ISpinnerProps } from "./types";

/**
 * Spinner
 */
export const Spinner = (props: ISpinnerProps): ISpinner => {
    // Method to get the component
    let get = () => {
        // Return the spinner
        return _spinner;
    }

    // Render a spinner
    props.el.innerHTML = [
        '<div class="ms-Spinner' + '">',
        '<div class="ms-Spinner-label">Loading the field...</div>',
        '</div>'
    ].join('\n');

    // Initialize the spinner
    let _spinner = new fabric.Spinner(props.el.querySelector(".ms-Spinner"));

    // Return the spinner
    return {
        get
    };
}