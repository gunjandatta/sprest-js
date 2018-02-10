import { Helper, SPTypes } from "gd-sprest";
import { fabric } from "../fabric";
import { TextField } from "./text";

export interface IBaseFieldProps {
    /** The element to render the field to. */
    el: Element | HTMLElement;

    /** The field information */
    fieldInfo: Helper.Types.IListFormFieldInfo;
}

/**
 * Base Field
 */
export const BaseField = (props: IBaseFieldProps) => {
    // Load the field information
    Helper.ListFormField.create(props.fieldInfo).then(fieldInfo => {
        // Render the field based on the type
        switch (fieldInfo.type) {
            case SPTypes.FieldType.Text:
                // Render the text field
                TextField.render(props.el, fieldInfo);
                break;
            default:
                // Log
                console.log("[gd-sprest] The field type '" + fieldInfo.typeAsString + "' is not supported.");
                break;
        }
    });

    // Render a spinner
    props.el.innerHTML = `
        <div class="ms-Spinner">
            <div class="ms-Spinner-label">Loading the field...</div>
        </div>
    `.trim();

    // Initialize the spinner
    new fabric.Spinner(props.el.firstChild as any);
}