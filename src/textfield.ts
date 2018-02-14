import { Fabric, ITextField, ITextFieldProps } from "./types";
import { fabric } from ".";

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
    // Method to get the text field element
    let get = (): HTMLInputElement => {
        // Returns the text field element
        return props.el.querySelector(".ms-TextField-field") as HTMLInputElement;
    }

    // Method to get the fabric component
    let getFabricComponent = () => {
        // Return the textfield
        return _textfield;
    }

    // Method to get the value
    let getValue = () => {
        // Get the text field
        return get().value;
    }

    // Method to set the error message
    let setErrorMessage = (message: string) => {
        // Get the error message
        let errorMessage = (_textfield ? _textfield._container : props.el.querySelector(".ms-TextField")).querySelector(".error");
        if (errorMessage) {
            // Set the error message
            errorMessage.innerHTML = message || "";
        }
    }

    // Method to set the value
    let setValue = (value: string) => {
        // Get the text field
        let textfield = get();
        if (textfield) {
            textfield.value = value;
        }
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

    // Set the class name
    let className = props.className || "";
    let isUnderline = false;
    if (props.placeholder) { className += " ms-TextField--placeholder" }
    if (props.type == TextFieldTypes.Multi) { className += " ms-TextField--multiline"; }
    else if (props.type != TextFieldTypes.Default) {
        className += " ms-TextField--underlined";
        isUnderline = true;
    }

    // Add the textfield html
    props.el.innerHTML = [
        '<div class="ms-TextField ' + className.trim() + '">',
        '<label class="ms-Label' + (props.required ? ' is-required' : '') + '"' + (isUnderline ? ' style="display:block"' : '') + '>' + (props.label || "") + '</label>',
        props.placeholder ? '<label class="ms-Label">' + props.placeholder + '</label>' : '',
        props.type == TextFieldTypes.Multi ?
            '<textarea class="ms-TextField-field"></textarea>' :
            '<input class="ms-TextField-field" type="text" value="' + (props.value || "") + '" placeholder=""></input>',
        '<label class="ms-Label ms-fontColor-redDark error" style="color:#a80000;"></label>',
        '</div>'
    ].join('\n');

    // Get the textfield
    let tb = get();

    // See if the textfield is disabled
    if (props.disable) {
        // Disable the textfield
        tb.disabled = true;
    }

    // Set the change event
    tb.onchange = () => {
        // Validate the value
        let value = (getValue() + "").trim();
        if (validate(value) && props.onChange) {
            // Call the change event
            props.onChange(value);
        }
    }

    // Validate the textfield
    validate(props.value);

    // Create the textfield
    let _textfield:Fabric.ITextField = new fabric.TextField(props.el.firstElementChild);

    // Return the text field
    return {
        get,
        getFabricComponent,
        getValue,
        setErrorMessage,
        setValue
    };
}