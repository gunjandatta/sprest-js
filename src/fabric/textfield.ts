import { Fabric, ITextField, ITextFieldProps } from "./types";
import { fabric, Templates } from ".";

/**
 * Text Field Types
 */
export enum TextFieldTypes {
    Default = 0,
    Multi = 1,
    Underline = 2
}

/**
 * Text Field
 */
export const TextField = (props: ITextFieldProps): ITextField => {
    // Method to get the fabric component
    let get = (): Fabric.ITextField => {
        // Return the textfield
        return _textfield;
    }

    // Method to get the value
    let getValue = () => {
        // Get the text field
        return _textfield._textField.value || "";
    }

    // Method to set the error message
    let setErrorMessage = (message: string) => {
        // Get the error message
        let errorMessage = _textfield._container.querySelector(".error");
        if (errorMessage) {
            // Set the error message
            errorMessage.innerHTML = message || "";
        }
    }

    // Method to set the value
    let setValue = (value: string) => {
        // Set the text field
        _textfield._textField.value = value || "";
    }

    // Method to validate the value
    let validate = (value: string): boolean => {
        // Clear the error message
        setErrorMessage("");

        // See if this field is required
        if (props.required && (value || "").length == 0) {
            // Set the error message
            setErrorMessage("This field is required");

            // Validation failed
            return false;
        }

        // Validation passed
        return true;
    }

    // Add the textfield html
    props.el.innerHTML = Templates.TextField(props);

    // Create the textfield
    let _textfield: Fabric.ITextField = new fabric.TextField(props.el.firstElementChild);
    let _value = props.value || "";

    // The change event
    let onChange = () => {
        let value = getValue().trim();

        // See if the value is the same
        if (value == _value) { return; }

        // Update the value
        _value = value;

        // Validate the value
        if (validate(value) && props.onChange) {
            // Call the change event
            props.onChange(value);
        }
    }

    // Set the blur event
    _textfield._textField.addEventListener("blur", onChange)

    // Set the change event
    _textfield._textField.addEventListener("change", onChange);

    // Set the focus event
    _textfield._textField.addEventListener("focus", onChange)

    // Validate the textfield
    validate(props.value);

    // Return the text field
    return {
        get,
        getValue,
        setErrorMessage,
        setValue
    };
}