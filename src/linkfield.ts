import { ILinkField, ILinkFieldProps, ILinkFieldValue } from "./types"
import { TextField, TextFieldTypes } from ".";

/**
 * Link Field
 */
export const LinkField = (props: ILinkFieldProps): ILinkField => {
    // Method to get the link element
    let get = (): HTMLInputElement => {
        // Returns the link element
        return _url ? _url.get() : null;
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

    // Add the link html
    props.el.innerHTML = [
        '<div class="url"></div>',
        '<div class="description"></div>'
    ].join('\n');

    // Create the url textfield
    let _url = TextField({
        disable: props.disable,
        el: props.el.children[0],
        label: props.label,
        onChange: props.onChange ? (value) => { props.onChange(getValue()) } : null,
        required: props.required,
        type: TextFieldTypes.Underline,
        value: props.value && props.value.Url ? props.value.Url : ""
    });

    // Create the description textfield
    let _desc = TextField({
        disable: props.disable,
        el: props.el.children[1],
        label: props.label + " Description",
        onChange: props.onChange ? (value) => { props.onChange(getValue()) } : null,
        required: props.required,
        type: TextFieldTypes.Underline,
        value: props.value && props.value.Description ? props.value.Description : ""
    });

    // Return the link
    return {
        get,
        getFabricComponent,
        getValue
    };
}
