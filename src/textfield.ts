import { ITextField, ITextFieldProps } from "./types";
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

    // Set the class name
    let className = props.className || "";
    if (props.placeholder) { className += " ms-TextField--placeholder" }
    if (props.type == TextFieldTypes.Multi) { className += " ms-TextField--multiline"; }
    if (props.type == TextFieldTypes.Underline) { className += " ms-TextField--underlined"; }

    // Add the button html
    props.el.innerHTML = [
        '<div class="ms-TextField ' + className.trim() + '">',
        '<label class="ms-Label"' + (props.type == TextFieldTypes.Underline ? 'style="display:block"' : '') + '>' + (props.label || "") + (props.required ? '<span class="ms-fontColor-redDark"> *</span>' : '') + '</label>',
        props.placeholder ? '<label class="ms-Label">' + props.placeholder + '</label>' : '',
        props.type == TextFieldTypes.Multi ?
            '<textarea class="ms-TextField-field"></textarea>' :
            '<input class="ms-TextField-field" type="text" value="' + (props.value || "") + '" placeholder=""></input>',
        '</div>'
    ].join('\n');

    // Get the textfield
    let tb = get();

    // See if the button is disabled
    if (props.disable) {
        // Disable the button
        tb.disabled = true;
    }

    // See if we are adding a change event
    if (props.onChange) {
        // Set the change event
        tb.onchange = () => {
            // Call the change event
            props.onChange(getValue());
        }
    }

    // Create the textfield
    let _textfield = new fabric.TextField(props.el.firstElementChild);

    // Return the text field
    return {
        get,
        getFabricComponent,
        getValue
    };
}