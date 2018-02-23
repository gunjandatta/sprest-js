import { fabric, Templates } from ".";
import { ISpinner, ISpinnerProps } from "./types";

/**
 * Spinner
 */
export const Spinner = (props: ISpinnerProps): ISpinner => {
    let _spinner = null;
    // Method to get the component
    let get = () => {
        // Return the spinner
        return _spinner;
    }

    // Ensure the element exists
    if (props.el) {
        // Render a spinner
        props.el.innerHTML = Templates.Spinner(props);

        // Initialize the spinner
        _spinner = new fabric.Spinner(props.el.querySelector(".ms-Spinner"));
    }

    // Return the spinner
    return {
        get
    };
}