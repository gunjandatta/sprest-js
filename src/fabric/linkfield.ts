import { ILinkField, ILinkFieldProps, ILinkFieldValue, ITextField } from "./types"
import { Templates, TextField, TextFieldTypes } from ".";

/**
 * Link Field
 */
export const LinkField = (props: ILinkFieldProps): ILinkField => {
    let _desc: ITextField = null;
    let _url: ITextField = null;

    // Method to get the link element
    let get = (): HTMLInputElement => {
        // Returns the link element
        return _url ? _url.get()._textField : null;
    }

    // Method to get the fabric component
    let getFabricComponent = () => {
        // Return the link
        return _url;
    }

    // Method to get the value
    let getValue = (): ILinkFieldValue => {
        // Get the link value
        return {
            Description: _desc ? _desc.getValue() : "",
            Url: _url ? _url.getValue() : ""
        };
    }

    // Method to validate the url
    let validate = (url: string) => {
        // Clear the error message
        _url.setErrorMessage("");

        // See if the url exists
        if (url) {
            // Validate the url
            if (/^https?\:\/\//.test(url) == false) {
                // Set the error message
                _url.setErrorMessage("The value must start with http:// or https://");
            }
        } else {
            // See if this field is required
            if (props.required) {
                // Set the error message
                _url.setErrorMessage("This field requires a value.");
            }
        }

        // Call the change event
        props.onChange ? (value) => { props.onChange(getValue()) } : null;
    }

    // See if the field is disabled
    if (props.disable) {
        // Add the link html
        props.el.innerHTML = Templates.LinkField(props);
    } else {
        // Add the link html
        props.el.innerHTML = [
            '<div class="url"></div>',
            '<div class="description"></div>'
        ].join('\n');

        // Create the url textfield
        _url = TextField({
            disable: props.disable,
            el: props.el.children[0],
            label: props.label,
            onChange: validate,
            required: props.required,
            type: TextFieldTypes.Underline,
            value: props.value && props.value.Url ? props.value.Url : ""
        });

        // Create the description textfield
        _desc = TextField({
            disable: props.disable,
            el: props.el.children[1],
            label: props.label + " Description",
            onChange: props.onChange ? (value) => { props.onChange(getValue()) } : null,
            required: props.required,
            type: TextFieldTypes.Underline,
            value: props.value && props.value.Description ? props.value.Description : ""
        });

        // Validate the url
        validate(props.value ? props.value.Url : "");
    }

    // Return the link
    return {
        get,
        getFabricComponent,
        getValue
    };
}
